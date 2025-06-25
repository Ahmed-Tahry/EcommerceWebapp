import { getDBPool } from '../utils/db';
import { IAccountDetails, IVatSetting, IInvoiceSettings, IUserOnboardingStatus } from '../models/settings.model';
// Pool type is not directly used, can be removed if not needed elsewhere.
// import { Pool } from 'pg';

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
    // If no record, create a default one (all steps false)
    const defaultStatus: Omit<IUserOnboardingStatus, 'createdAt'|'updatedAt'> = { userId, hasConfiguredBolApi: false };
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
  const { userId, hasConfiguredBolApi } = statusData; // Add other steps as they are defined

  // Build SET clauses dynamically for defined fields in statusData
  const updateFields: string[] = [];
  const values: any[] = [userId];
  let valueCounter = 2;

  if (hasConfiguredBolApi !== undefined) {
    updateFields.push(`has_configured_bol_api = $${valueCounter++}`);
    values.push(hasConfiguredBolApi);
  }
  // Add other fields here:
  // if (statusData.hasCompletedVatSetup !== undefined) {
  //   updateFields.push(`has_completed_vat_setup = $${valueCounter++}`);
  //   values.push(statusData.hasCompletedVatSetup);
  // }

  if (updateFields.length === 0 && ! (await getOnboardingStatus(userId))) { // No specific fields to update, but record might not exist
     // This case means only userId was passed, and no record exists. Create with defaults.
     updateFields.push(`has_configured_bol_api = $${valueCounter++}`);
     values.push(false); // Default value
  } else if (updateFields.length === 0) { // Record exists, no fields to update
      const existingStatus = await getOnboardingStatus(userId);
      if(existingStatus) return existingStatus;
      // This should not be reached if logic is correct, but as a fallback:
      throw new Error("Onboarding status exists but no update fields provided, and could not retrieve current state.");
  }


  const query = `
    INSERT INTO user_onboarding_status (user_id, ${updateFields.map(f => f.split(" = ")[0]).join(", ")})
    VALUES ($1, ${values.slice(1).map((_,i) => `$${i+2}`).join(", ")})
    ON CONFLICT (user_id) DO UPDATE SET
      ${updateFields.join(", ")},
      updated_at = NOW()
    RETURNING user_id AS "userId", has_configured_bol_api AS "hasConfiguredBolApi", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
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
