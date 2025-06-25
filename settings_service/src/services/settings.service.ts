import { getDBPool } from '../utils/db';
import { IAccountDetails, IVatSetting, IInvoiceSettings, IUserOnboardingStatus } from '../models/settings.model';
// Pool type is not directly used, can be removed if not needed elsewhere.
// import { Pool } from 'pg';

const PRIMARY_KEY_VALUE = 'primary'; // For single-row tables like invoice_settings

// Helper to convert camelCase to snake_case for DB columns
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// --- Account Details Service (Per-User) ---

export async function getAccountDetailsByUserId(userId: string): Promise<IAccountDetails | null> {
  const pool = getDBPool();
  try {
    const result = await pool.query(
      'SELECT id, user_id AS "userId", bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret", created_at AS "createdAt", updated_at AS "updatedAt" FROM account_details WHERE user_id = $1',
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching account details for user ID ${userId}:`, error);
    throw error;
  }
}

export async function saveAccountDetails(
  userId: string,
  details: Partial<Omit<IAccountDetails, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<IAccountDetails> {
  const pool = getDBPool();
  const { bolClientId, bolClientSecret } = details;

  // Upsert logic: Insert if not exists, update if exists for the given userId.
  const query = `
    INSERT INTO account_details (user_id, bol_client_id, bol_client_secret)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET
      bol_client_id = EXCLUDED.bol_client_id,
      bol_client_secret = EXCLUDED.bol_client_secret,
      updated_at = NOW()
    RETURNING id, user_id AS "userId", bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, [userId, bolClientId, bolClientSecret]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error saving account details for user ID ${userId}:`, error);
    throw error;
  }
}


// --- User Onboarding Status Service ---

export async function getOnboardingStatus(userId: string): Promise<IUserOnboardingStatus | null> {
  const pool = getDBPool();
  try {
    const result = await pool.query(
      'SELECT user_id AS "userId", has_configured_bol_api AS "hasConfiguredBolApi", created_at AS "createdAt", updated_at AS "updatedAt" FROM user_onboarding_status WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    // If no record, create a default one with all steps false
    const defaultStatus: Omit<IUserOnboardingStatus, 'createdAt'|'updatedAt'> = {
      userId,
      hasConfiguredBolApi: false,
      hasCompletedShopSync: false,
      hasCompletedVatSetup: false,
      hasCompletedInvoiceSetup: false,
    };
    return createOrUpdateOnboardingStatus(defaultStatus);

  } catch (error) {
    console.error(`Error fetching onboarding status for user ID ${userId}:`, error);
    throw error;
  }
}

// Using a more generic update function to handle various steps
export async function updateOnboardingStatus(
  userId: string,
  statusUpdates: Partial<Omit<IUserOnboardingStatus, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<IUserOnboardingStatus> {
    return createOrUpdateOnboardingStatus({ userId, ...statusUpdates });
}


async function createOrUpdateOnboardingStatus(
  statusData: Partial<IUserOnboardingStatus> & { userId: string }
): Promise<IUserOnboardingStatus> {
  const pool = getDBPool();
  const {
    userId,
    hasConfiguredBolApi,
    hasCompletedShopSync,
    hasCompletedVatSetup,
    hasCompletedInvoiceSetup
  } = statusData;

  const updateFields: string[] = [];
  const insertFields: string[] = ['user_id'];
  const insertValuesPlaceholders: string[] = ['$1'];
  const values: any[] = [userId];
  let valueCounter = 2;

  // Helper to add field to update and insert lists
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
  addField('has_completed_vat_setup', hasCompletedVatSetup);
  addField('has_completed_invoice_setup', hasCompletedInvoiceSetup);

  // If it's a new record and no specific true/false values were passed for some fields,
  // they should default to false as per DB schema.
  // The INSERT part will handle this if columns are not in statusData.
  // However, if a field is explicitly 'undefined' in statusData but we want to ensure it's part of the INSERT with default.
  // The current addField logic correctly omits undefined fields from the dynamic query parts.
  // The DB default will apply for INSERT if a column is not listed.
  // For ON CONFLICT DO UPDATE, we only update fields that were explicitly passed.

  if (updateFields.length === 0) {
    // No actual fields to update were provided.
    // Try to fetch existing status. If it exists, return it.
    // If it doesn't exist, it means we were called with just userId (or all other fields undefined)
    // and the intention might be to create a default record.
    // The getOnboardingStatus already handles creating a full default record.
    // This situation (updateFields.length === 0) implies either:
    // 1. An attempt to "touch" the record without changes (return existing or create default if missing).
    // 2. Or, an empty body was sent to the update endpoint.
    const existingStatus = await pool.query(
      `SELECT user_id AS "userId", has_configured_bol_api AS "hasConfiguredBolApi", has_completed_shop_sync AS "hasCompletedShopSync", has_completed_vat_setup AS "hasCompletedVatSetup", has_completed_invoice_setup AS "hasCompletedInvoiceSetup", created_at AS "createdAt", updated_at AS "updatedAt"
       FROM user_onboarding_status WHERE user_id = $1`,
      [userId]
    );
    if (existingStatus.rows.length > 0) {
      return existingStatus.rows[0];
    }
    // If no fields to update and record doesn't exist, we should insert a default.
    // This case is better handled by getOnboardingStatus which prepares a full default object.
    // If this function is called directly with only userId for a non-existent user,
    // we need to ensure all default values are set for the INSERT part.
    // The current `addField` logic will result in an INSERT with only user_id if all other fields are undefined.
    // The DB defaults (FALSE) should then apply.
    if (insertFields.length === 1 && insertFields[0] === 'user_id') { // Only userId was provided
        // Add default false values for all fields for the INSERT part
        // This ensures the RETURNING clause gets all fields.
        if (hasConfiguredBolApi === undefined) { addField('has_configured_bol_api', false); }
        if (hasCompletedShopSync === undefined) { addField('has_completed_shop_sync', false); }
        if (hasCompletedVatSetup === undefined) { addField('has_completed_vat_setup', false); }
        if (hasCompletedInvoiceSetup === undefined) { addField('has_completed_invoice_setup', false); }
    }
  }
   if (insertFields.length === 1 && insertFields[0] === 'user_id' && updateFields.length > 0) {
    // This means all fields in statusData were undefined except userId, but somehow updateFields got populated.
    // This should not happen with current addField logic. Defensive check.
    throw new Error("Logical error in createOrUpdateOnboardingStatus: updateFields populated with only userId defined.");
  }


  const query = `
    INSERT INTO user_onboarding_status (${insertFields.join(", ")})
    VALUES (${insertValuesPlaceholders.join(", ")})
    ON CONFLICT (user_id) DO UPDATE SET
      ${updateFields.join(", ")},
      updated_at = NOW()
    WHERE user_onboarding_status.user_id = $1  -- Ensure update only happens for the specific user
    RETURNING
      user_id AS "userId",
      has_configured_bol_api AS "hasConfiguredBolApi",
      has_completed_shop_sync AS "hasCompletedShopSync",
      has_completed_vat_setup AS "hasCompletedVatSetup",
      has_completed_invoice_setup AS "hasCompletedInvoiceSetup",
      created_at AS "createdAt",
      updated_at AS "updatedAt";
  `;
  try {
    // console.log("Executing query:", query, "with values:", values); // For debugging
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`Error creating/updating onboarding status for user ID ${userId}:`, error);
    throw error;
  }
}


// --- VAT Settings Service (Remains System-Wide for now) ---

// export async function createVatSetting(settingData: Omit<IVatSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<IVatSetting> {
//   } catch (error) {
//     console.error('Error saving account details:', error);
//     throw error;
//   }
// }

// --- VAT Settings Service ---

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
  if(updates.name !== undefined) validUpdates.name = updates.name;
  if(updates.rate !== undefined) validUpdates.rate = updates.rate;
  if(updates.isDefault !== undefined) validUpdates.isDefault = updates.isDefault;

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

export async function getInvoiceSettings(): Promise<IInvoiceSettings | null> {
  const pool = getDBPool();
  try {
    const result = await pool.query(
      'SELECT id, company_name AS "companyName", company_address AS "companyAddress", vat_number AS "vatNumber", default_invoice_notes AS "defaultInvoiceNotes", invoice_prefix AS "invoicePrefix", next_invoice_number AS "nextInvoiceNumber", created_at AS "createdAt", updated_at AS "updatedAt" FROM invoice_settings WHERE id = $1', [PRIMARY_KEY_VALUE]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
     // If 'primary' row doesn't exist, attempt to create it with nulls
    console.warn(`Primary invoice_settings row not found. Attempting to create with default values.`);
    const insertQuery = `
        INSERT INTO invoice_settings (id)
        VALUES ($1)
        ON CONFLICT (id) DO NOTHING
        RETURNING id, company_name AS "companyName", company_address AS "companyAddress", vat_number AS "vatNumber", default_invoice_notes AS "defaultInvoiceNotes", invoice_prefix AS "invoicePrefix", next_invoice_number AS "nextInvoiceNumber", created_at AS "createdAt", updated_at AS "updatedAt";`;
    const insertResult = await pool.query(insertQuery, [PRIMARY_KEY_VALUE]);
    if (insertResult.rows.length > 0) return insertResult.rows[0];
    return null;

  } catch (error) {
    console.error('Error fetching invoice settings:', error);
    throw error;
  }
}

export async function saveInvoiceSettings(settings: Partial<Omit<IInvoiceSettings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IInvoiceSettings> {
  const pool = getDBPool();

  // Explicitly map fields to avoid issues with extra properties
  const updateData: Partial<IInvoiceSettings> = {};
  if(settings.companyName !== undefined) updateData.companyName = settings.companyName;
  if(settings.companyAddress !== undefined) updateData.companyAddress = settings.companyAddress;
  if(settings.vatNumber !== undefined) updateData.vatNumber = settings.vatNumber;
  if(settings.defaultInvoiceNotes !== undefined) updateData.defaultInvoiceNotes = settings.defaultInvoiceNotes;
  if(settings.invoicePrefix !== undefined) updateData.invoicePrefix = settings.invoicePrefix;
  if(settings.nextInvoiceNumber !== undefined) updateData.nextInvoiceNumber = settings.nextInvoiceNumber;


  const setClauses = Object.keys(updateData)
    .map((key, i) => `"${toSnakeCase(key)}" = $${i + 1}`)
    .join(', ');

  if (setClauses.length === 0 && Object.keys(settings).length > 0) {
     const currentSettings = await getInvoiceSettings();
     if(!currentSettings) throw new Error("Failed to retrieve current invoice settings after no-op save.");
     return currentSettings;
  }
   if (setClauses.length === 0) { // No data provided at all
    const currentSettings = await getInvoiceSettings();
    if (!currentSettings) throw new Error("Primary invoice_settings row missing and could not be created.");
    return currentSettings;
  }

  const values = Object.values(updateData);
  values.push(PRIMARY_KEY_VALUE);

  const query = `
    UPDATE invoice_settings
    SET ${setClauses}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING id, company_name AS "companyName", company_address AS "companyAddress", vat_number AS "vatNumber", default_invoice_notes AS "defaultInvoiceNotes", invoice_prefix AS "invoicePrefix", next_invoice_number AS "nextInvoiceNumber", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, values);
     if (result.rows.length > 0) {
        return result.rows[0];
    }
    const currentSettings = await getInvoiceSettings();
    if (!currentSettings) throw new Error("Invoice settings not found and could not be saved/retrieved.");
    return currentSettings;

  } catch (error) {
    console.error('Error saving invoice settings:', error);
    throw error;
  }
}
