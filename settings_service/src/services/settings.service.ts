import { getDBPool } from '../utils/db';
import { IAccountDetails, IVatSetting, IInvoiceSettings } from '../models/settings.model';
import { Pool } from 'pg';

const PRIMARY_KEY_VALUE = 'primary'; // For single-row tables

// Helper to convert camelCase to snake_case for DB columns
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// --- Account Details Service ---

export async function getAccountDetails(): Promise<IAccountDetails | null> {
  const pool = getDBPool();
  try {
    const result = await pool.query('SELECT id, bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret", created_at AS "createdAt", updated_at AS "updatedAt" FROM account_details WHERE id = $1', [PRIMARY_KEY_VALUE]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    // If 'primary' row doesn't exist, attempt to create it with nulls
    // This handles the very first run if the INSERT ON CONFLICT in DDL didn't cover all scenarios
    console.warn(`Primary account_details row not found. Attempting to create with null values.`);
    const insertQuery = `
        INSERT INTO account_details (id, bol_client_id, bol_client_secret)
        VALUES ($1, NULL, NULL)
        ON CONFLICT (id) DO NOTHING
        RETURNING id, bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret", created_at AS "createdAt", updated_at AS "updatedAt";`;
    const insertResult = await pool.query(insertQuery, [PRIMARY_KEY_VALUE]);
    if (insertResult.rows.length > 0) return insertResult.rows[0];
    return null;


  } catch (error) {
    console.error('Error fetching account details:', error);
    throw error;
  }
}

export async function saveAccountDetails(details: Partial<Omit<IAccountDetails, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IAccountDetails> {
  const pool = getDBPool();

  const updateFields: Partial<IAccountDetails> = {};
  if (details.bolClientId !== undefined) updateFields.bolClientId = details.bolClientId;
  if (details.bolClientSecret !== undefined) updateFields.bolClientSecret = details.bolClientSecret;

  const setClauses = Object.keys(updateFields)
    .map((key, i) => `"${toSnakeCase(key)}" = $${i + 1}`)
    .join(', ');

  if (setClauses.length === 0 && Object.keys(details).length > 0) { // No recognized fields to update
     const currentDetails = await getAccountDetails();
     if (!currentDetails) throw new Error("Failed to retrieve current account details after no-op save.");
     return currentDetails;
  }
  if (setClauses.length === 0) { // No data provided at all
    const currentDetails = await getAccountDetails();
    if (!currentDetails) throw new Error("Primary account_details row missing and could not be created.");
    return currentDetails;
  }


  const values = Object.values(updateFields);
  values.push(PRIMARY_KEY_VALUE); // For the WHERE clause

  const query = `
    UPDATE account_details
    SET ${setClauses}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING id, bol_client_id AS "bolClientId", bol_client_secret AS "bolClientSecret", created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    // This might happen if the 'primary' row didn't exist and UPDATE affected 0 rows.
    // Try to get it again, which might create it if it was missing.
    const currentDetails = await getAccountDetails();
    if (!currentDetails) throw new Error("Account details not found and could not be saved/retrieved.");
    return currentDetails;

  } catch (error) {
    console.error('Error saving account details:', error);
    throw error;
  }
}

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
