import { getDBPool } from '../utils/db';
import { IAccountDetails, IVatSetting, IInvoiceSettings, IUserOnboardingStatus, IGeneralSettings, IShop } from '../models/settings.model';

// Helper to convert camelCase to snake_case for DB columns
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// --- Account Details Service ---

export async function getAccountDetailsByShopId(shopId: string): Promise<IAccountDetails | null> {
  const pool = getDBPool();
  const query = `
    SELECT id, user_id AS "userId", shop_id AS "shopId", bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret",
           sales_number AS "salesNumber", status, api_credentials AS "apiCredentials", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM account_details WHERE shop_id = $1
  `;
  try {
    const result = await pool.query(query, [shopId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching account details for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function saveAccountDetails(
  userId: string,
  shopId: string,
  details: Partial<Omit<IAccountDetails, 'id' | 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>>
): Promise<IAccountDetails> {
  const pool = getDBPool();
  const { bolClientId, bolClientSecret, salesNumber, status, apiCredentials } = details;

  // First, try to update existing record
  const updateQuery = `
    UPDATE account_details
    SET bol_client_id = COALESCE($3, bol_client_id),
        bol_client_secret = COALESCE($4, bol_client_secret),
        sales_number = COALESCE($5, sales_number),
        status = COALESCE($6, status),
        api_credentials = COALESCE($7, api_credentials),
        updated_at = NOW()
    WHERE user_id = $1 AND shop_id = $2
    RETURNING id, user_id AS "userId", shop_id AS "shopId", bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret",
           sales_number AS "salesNumber", status, api_credentials AS "apiCredentials", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  
  try {
    // Try to update first
    let result = await pool.query(updateQuery, [
      userId, 
      shopId, 
      bolClientId, 
      bolClientSecret, 
      salesNumber, 
      status, 
      apiCredentials ? JSON.stringify(apiCredentials) : null
    ]);
    
    // If no rows were updated, insert new record
    if (result.rows.length === 0) {
      const insertQuery = `
        INSERT INTO account_details (user_id, shop_id, bol_client_id, bol_client_secret, sales_number, status, api_credentials)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id AS "userId", shop_id AS "shopId", bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret",
               sales_number AS "salesNumber", status, api_credentials AS "apiCredentials", created_at AS "createdAt", updated_at AS "updatedAt";
      `;
      
      result = await pool.query(insertQuery, [
        userId, 
        shopId, 
        bolClientId, 
        bolClientSecret, 
        salesNumber, 
        status, 
        apiCredentials ? JSON.stringify(apiCredentials) : null
      ]);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error saving account details for userId ${userId}, shopId ${shopId}:`, error);
    throw error;
  }
}

// --- User Onboarding Status Service ---

export async function getOnboardingStatus(userId: string, shopId: string): Promise<IUserOnboardingStatus | null> {
  const pool = getDBPool();
  try {
    const result = await pool.query(
      `SELECT user_id AS "userId", shop_id AS "shopId", has_configured_bol_api AS "hasConfiguredBolApi",
               has_completed_shop_sync AS "hasCompletedShopSync", has_completed_invoice_setup AS "hasCompletedInvoiceSetup",
               has_completed_vat_setup AS "hasCompletedVatSetup", created_at AS "createdAt", updated_at AS "updatedAt"
        FROM user_onboarding_status WHERE user_id = $1 AND shop_id = $2`,
      [userId, shopId]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    // Create default status if none exists
    const defaultStatus: Omit<IUserOnboardingStatus, 'createdAt' | 'updatedAt'> = {
      userId,
      shopId,
      hasConfiguredBolApi: false,
      hasCompletedShopSync: false,
      hasCompletedInvoiceSetup: false,
      hasCompletedVatSetup: false,
    };
    return await createOrUpdateOnboardingStatus(defaultStatus);
  } catch (error) {
    console.error(`Error fetching onboarding status for userId ${userId}, shopId ${shopId}:`, error);
    throw error;
  }
}

export async function updateOnboardingStatus(
  userId: string,
  shopId: string,
  statusUpdates: Partial<Omit<IUserOnboardingStatus, 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>>
): Promise<IUserOnboardingStatus> {
  return createOrUpdateOnboardingStatus({ userId, shopId, ...statusUpdates });
}

async function createOrUpdateOnboardingStatus(
  statusData: Partial<IUserOnboardingStatus> & { userId: string; shopId: string }
): Promise<IUserOnboardingStatus> {
  const pool = getDBPool();
  const { userId, shopId, hasConfiguredBolApi, hasCompletedShopSync, hasCompletedInvoiceSetup, hasCompletedVatSetup } = statusData;

  const updateFields: string[] = [];
  const insertFields: string[] = ['user_id', 'shop_id'];
  const insertValuesPlaceholders: string[] = ['$1', '$2'];
  const values: any[] = [userId, shopId];
  let valueCounter = 3;

  const addField = (fieldNameDb: string, value: any) => {
    if (value !== undefined) {
      updateFields.push(`${fieldNameDb} = $${valueCounter}`);
      insertFields.push(fieldNameDb);
      insertValuesPlaceholders.push(`$${valueCounter}`);
      values.push(value);
      valueCounter++;
    }
  };

  addField('has_configured_bol_api', hasConfiguredBolApi);
  addField('has_completed_shop_sync', hasCompletedShopSync);
  addField('has_completed_invoice_setup', hasCompletedInvoiceSetup);
  addField('has_completed_vat_setup', hasCompletedVatSetup);

  if (updateFields.length === 0) {
    const existingStatus = await pool.query(
      `SELECT user_id AS "userId", shop_id AS "shopId", has_configured_bol_api AS "hasConfiguredBolApi",
              has_completed_shop_sync AS "hasCompletedShopSync", has_completed_invoice_setup AS "hasCompletedInvoiceSetup",
              has_completed_vat_setup AS "hasCompletedVatSetup",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM user_onboarding_status WHERE user_id = $1 AND shop_id = $2`,
      [userId, shopId]
    );
    if (existingStatus.rows.length > 0) {
      return existingStatus.rows[0];
    }
    // Add default false values for INSERT
    if (hasConfiguredBolApi === undefined) { addField('has_configured_bol_api', false); }
    if (hasCompletedShopSync === undefined) { addField('has_completed_shop_sync', false); }
    if (hasCompletedInvoiceSetup === undefined) { addField('has_completed_invoice_setup', false); }
  }

  const query = `
    INSERT INTO user_onboarding_status (${insertFields.join(", ")})
    VALUES (${insertValuesPlaceholders.join(", ")})
    ON CONFLICT (user_id, shop_id) DO UPDATE SET
      ${updateFields.join(", ")},
      updated_at = NOW()
    WHERE user_onboarding_status.user_id = $1 AND user_onboarding_status.shop_id = $2
    RETURNING
      user_id AS "userId",
      shop_id AS "shopId",
      has_configured_bol_api AS "hasConfiguredBolApi",
      has_completed_shop_sync AS "hasCompletedShopSync",
      has_completed_invoice_setup AS "hasCompletedInvoiceSetup",
      has_completed_vat_setup AS "hasCompletedVatSetup",
      created_at AS "createdAt",
      updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`Error creating/updating onboarding status for userId ${userId}, shopId ${shopId}:`, error);
    throw error;
  }
}

// --- VAT Settings Service (Unchanged, system-wide) ---

export async function createVatSetting(settingData: Omit<IVatSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<IVatSetting> {
  const pool = getDBPool();
  const { name, rate, isDefault = false } = settingData;
  const query = `
    INSERT INTO vat_settings (name, rate, is_default)
    VALUES ($1, $2, $3)
    RETURNING id, name, rate, is_default AS "isDefault", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, [name, rate, isDefault]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating VAT setting:', error);
    throw error;
  }
}

export async function getAllVatSettings(): Promise<IVatSetting[]> {
  const pool = getDBPool();
  try {
    const result = await pool.query('SELECT id, name, rate, is_default AS "isDefault", created_at AS "createdAt", updated_at AS "updatedAt" FROM vat_settings ORDER BY name;');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all VAT settings:', error);
    throw error;
  }
}

export async function getVatSettingById(id: string): Promise<IVatSetting | null> {
  const pool = getDBPool();
  try {
    const result = await pool.query('SELECT id, name, rate, is_default AS "isDefault", created_at AS "createdAt", updated_at AS "updatedAt" FROM vat_settings WHERE id = $1;', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching VAT setting by ID ${id}:`, error);
    throw error;
  }
}

export async function updateVatSetting(id: string, updates: Partial<Omit<IVatSetting, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IVatSetting | null> {
  const pool = getDBPool();

  const validUpdates: Partial<Omit<IVatSetting, 'id' | 'createdAt' | 'updatedAt'>> = {};
  if (updates.name !== undefined) validUpdates.name = updates.name;
  if (updates.rate !== undefined) validUpdates.rate = updates.rate;
  if (updates.isDefault !== undefined) validUpdates.isDefault = updates.isDefault;

  const setClauses = Object.keys(validUpdates)
    .map((key, i) => `"${toSnakeCase(key)}" = $${i + 1}`)
    .join(', ');

  if (setClauses.length === 0) {
    return getVatSettingById(id);
  }

  const values = Object.values(validUpdates);
  values.push(id);

  const query = `
    UPDATE vat_settings
    SET ${setClauses}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING id, name, rate, is_default AS "isDefault", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating VAT setting ID ${id}:`, error);
    throw error;
  }
}

export async function deleteVatSetting(id: string): Promise<boolean> {
  const pool = getDBPool();
  try {
    const result = await pool.query('DELETE FROM vat_settings WHERE id = $1;', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting VAT setting ID ${id}:`, error);
    throw error;
  }
}

// --- Invoice Settings Service ---

export async function getInvoiceSettings(shopId: string): Promise<IInvoiceSettings | null> {
  const pool = getDBPool();
  const query = `
    SELECT shop_id AS "shopId", company_name AS "companyName", company_address AS "companyAddress", company_phone AS "companyPhone",
           company_email AS "companyEmail", invoice_prefix AS "invoicePrefix", vat_number AS "vatNumber", default_invoice_notes AS "defaultInvoiceNotes",
           next_invoice_number AS "nextInvoiceNumber", bank_account AS "bankAccount", start_number AS "startNumber", file_name_base AS "fileNameBase",
           created_at AS "createdAt", updated_at AS "updatedAt"
    FROM invoice_settings WHERE shop_id = $1
  `;
  try {
    const result = await pool.query(query, [shopId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching invoice settings for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function saveInvoiceSettings(shopId: string, settings: Partial<Omit<IInvoiceSettings, 'shopId' | 'createdAt' | 'updatedAt'>>): Promise<IInvoiceSettings> {
  const pool = getDBPool();
  const updateData: Partial<IInvoiceSettings> = {};
  if (settings.companyName !== undefined) updateData.companyName = settings.companyName;
  if (settings.companyAddress !== undefined) updateData.companyAddress = settings.companyAddress;
  if (settings.companyPhone !== undefined) updateData.companyPhone = settings.companyPhone;
  if (settings.companyEmail !== undefined) updateData.companyEmail = settings.companyEmail;
  if (settings.invoicePrefix !== undefined) updateData.invoicePrefix = settings.invoicePrefix;
  if (settings.vatNumber !== undefined) updateData.vatNumber = settings.vatNumber;
  if (settings.defaultInvoiceNotes !== undefined) updateData.defaultInvoiceNotes = settings.defaultInvoiceNotes;
  if (settings.nextInvoiceNumber !== undefined) updateData.nextInvoiceNumber = settings.nextInvoiceNumber;
  if (settings.bankAccount !== undefined) updateData.bankAccount = settings.bankAccount;
  // Only include startNumber and fileNameBase if they are provided and not undefined
  if (settings.startNumber !== undefined) updateData.startNumber = settings.startNumber;
  if (settings.fileNameBase !== undefined) updateData.fileNameBase = settings.fileNameBase;

  const setClauses = Object.keys(updateData)
    .map((key, i) => `"${toSnakeCase(key)}" = $${i + 2}`)
    .join(', ');

  if (setClauses.length === 0) {
    const currentSettings = await getInvoiceSettings(shopId);
    if (!currentSettings) throw new Error(`Invoice settings not found for shopId ${shopId} and could not be created.`);
    return currentSettings;
  }

  const values = [shopId, ...Object.values(updateData)];
  const query = `
    INSERT INTO invoice_settings (shop_id, ${Object.keys(updateData).map(key => toSnakeCase(key)).join(', ')})
    VALUES ($1, ${Object.keys(updateData).map((_, i) => `$${i + 2}`).join(', ')})
    ON CONFLICT (shop_id) DO UPDATE SET
      ${setClauses},
      updated_at = NOW()
    WHERE invoice_settings.shop_id = $1
    RETURNING shop_id AS "shopId", company_name AS "companyName", company_address AS "companyAddress", company_phone AS "companyPhone",
           company_email AS "companyEmail", invoice_prefix AS "invoicePrefix", vat_number AS "vatNumber", default_invoice_notes AS "defaultInvoiceNotes",
           next_invoice_number AS "nextInvoiceNumber", bank_account AS "bankAccount", start_number AS "startNumber", file_name_base AS "fileNameBase",
           created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`Error saving invoice settings for shopId ${shopId}:`, error);
    throw error;
  }
}

// --- General Settings Service ---

export async function getGeneralSettings(shopId: string): Promise<IGeneralSettings | null> {
  const pool = getDBPool();
  const query = `
    SELECT shop_id AS "shopId", firstname, surname, address, postcode, city, account_email AS "accountEmail", phone_number AS "phoneNumber",
           company_name AS "companyName", company_address AS "companyAddress", company_postcode AS "companyPostcode", company_city AS "companyCity",
           customer_email AS "customerEmail", company_phone_number AS "companyPhoneNumber", chamber_of_commerce AS "chamberOfCommerce",
           vat_number AS "vatNumber", iban, optional_vat_number AS "optionalVatNumber", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM general_settings WHERE shop_id = $1
  `;
  try {
    const result = await pool.query(query, [shopId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching general settings for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function saveGeneralSettings(shopId: string, settings: Partial<Omit<IGeneralSettings, 'shopId' | 'createdAt' | 'updatedAt'>>): Promise<IGeneralSettings> {
  const pool = getDBPool();
  const fields = [
    'firstname', 'surname', 'address', 'postcode', 'city', 'account_email', 'phone_number',
    'company_name', 'company_address', 'company_postcode', 'company_city', 'customer_email',
    'company_phone_number', 'chamber_of_commerce', 'vat_number', 'iban', 'optional_vat_number'
  ];
  const camelMap: Record<string, keyof Omit<IGeneralSettings, 'shopId' | 'createdAt' | 'updatedAt'>> = {
    firstname: 'firstname',
    surname: 'surname',
    address: 'address',
    postcode: 'postcode',
    city: 'city',
    account_email: 'accountEmail',
    phone_number: 'phoneNumber',
    company_name: 'companyName',
    company_address: 'companyAddress',
    company_postcode: 'companyPostcode',
    company_city: 'companyCity',
    customer_email: 'customerEmail',
    company_phone_number: 'companyPhoneNumber',
    chamber_of_commerce: 'chamberOfCommerce',
    vat_number: 'vatNumber',
    iban: 'iban',
    optional_vat_number: 'optionalVatNumber',
  };
  const values = fields.map(f => settings[camelMap[f]] ?? null);
  const query = `
    INSERT INTO general_settings (
      shop_id, ${fields.join(', ')}
    ) VALUES (
      $1, ${fields.map((_, i) => `$${i + 2}`).join(', ')}
    )
    ON CONFLICT (shop_id) DO UPDATE SET
      ${fields.map((f, i) => `${f} = EXCLUDED.${f}`).join(', ')},
      updated_at = NOW()
    RETURNING shop_id AS "shopId", firstname, surname, address, postcode, city, account_email AS "accountEmail", phone_number AS "phoneNumber",
           company_name AS "companyName", company_address AS "companyAddress", company_postcode AS "companyPostcode", company_city AS "companyCity",
           customer_email AS "customerEmail", company_phone_number AS "companyPhoneNumber", chamber_of_commerce AS "chamberOfCommerce",
           vat_number AS "vatNumber", iban, optional_vat_number AS "optionalVatNumber", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, [shopId, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error saving general settings for shopId ${shopId}:`, error);
    throw error;
  }
}

// --- Shop Service ---

export async function createShop(shopData: Omit<IShop, 'id' | 'createdAt' | 'updatedAt'>): Promise<IShop> {
  const pool = getDBPool();
  const { userId, shopId, name, description } = shopData;

  const query = `
    INSERT INTO shops (user_id, shop_id, name, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id, user_id AS "userId", shop_id AS "shopId", name, description, created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, [userId, shopId, name, description]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error creating shop for userId ${userId}, shopId ${shopId}:`, error);
    throw error;
  }
}

export async function getShopsByUserId(userId: string): Promise<IShop[]> {
  const pool = getDBPool();
  const query = `
    SELECT id, user_id AS "userId", shop_id AS "shopId", name, description, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM shops WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error(`Error fetching shops for userId ${userId}:`, error);
    throw error;
  }
}

export async function getShopByShopId(userId: string, shopId: string): Promise<IShop | null> {
  const pool = getDBPool();
  const query = `
    SELECT id, user_id AS "userId", shop_id AS "shopId", name, description, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM shops WHERE user_id = $1 AND shop_id = $2
  `;
  try {
    const result = await pool.query(query, [userId, shopId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching shop with shopId ${shopId} for userId ${userId}:`, error);
    throw error;
  }
}

export async function updateShop(userId: string, shopId: string, shopData: Partial<Omit<IShop, 'id' | 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>>): Promise<IShop | null> {
  const pool = getDBPool();
  const { name, description } = shopData;
  
  const query = `
    UPDATE shops 
    SET name = COALESCE($3, name), 
        description = COALESCE($4, description), 
        updated_at = NOW()
    WHERE user_id = $1 AND shop_id = $2
    RETURNING id, user_id AS "userId", shop_id AS "shopId", name, description, created_at AS "createdAt", updated_at AS "updatedAt"
  `;
  
  try {
    const result = await pool.query(query, [userId, shopId, name, description]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating shop with shopId ${shopId} for userId ${userId}:`, error);
    throw error;
  }
}

export async function deleteShop(userId: string, shopId: string): Promise<boolean> {
  const pool = getDBPool();
  const query = `
    DELETE FROM shops 
    WHERE user_id = $1 AND shop_id = $2
  `;
  
  try {
    const result = await pool.query(query, [userId, shopId]);
    return (result.rowCount || 0) > 0;
  } catch (error) {
    console.error(`Error deleting shop with shopId ${shopId} for userId ${userId}:`, error);
    throw error;
  }
}

function toCamelCase(s: string) {
  return s.replace(/_([a-z])/g, g => g[1].toUpperCase());
}