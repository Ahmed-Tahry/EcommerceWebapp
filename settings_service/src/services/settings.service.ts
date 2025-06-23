import { getDBPool } from '../utils/db';
import { IProductVat, IAccountSetting } from '../models/settings.model.ts';

// --- Service functions for ProductsVat CRUD ---

export async function createProductVat(productVatData: IProductVat): Promise<IProductVat> {
  const pool = getDBPool();
  const {
    productId,
    ean,
    productName,
    basePrice = null,
    vatRate,
    vatCategory = null,
    countryCode,
    isCompound = false,
    appliesToShipping = false,
    createdDateTime = new Date(), // Will be overridden by DB default if column has it
    updatedDateTime = new Date(), // Will be overridden by DB default if column has it
    isActive = true,
  } = productVatData;

  // Ensure createdDateTime and updatedDateTime are valid Date objects or will be handled by DB
  const pCreatedDateTime = createdDateTime instanceof Date ? createdDateTime : new Date();
  const pUpdatedDateTime = updatedDateTime instanceof Date ? updatedDateTime : new Date();

  const query = `
    INSERT INTO products_vat (
      "productId", ean, "productName", "basePrice", "vatRate", "vatCategory",
      "countryCode", "isCompound", "appliesToShipping", "createdDateTime",
      "updatedDateTime", "isActive"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [
    productId, ean, productName, basePrice, vatRate, vatCategory,
    countryCode, isCompound, appliesToShipping, pCreatedDateTime,
    pUpdatedDateTime, isActive
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating product VAT:', error);
    throw error;
  }
}

export async function getProductVatById(productId: string): Promise<IProductVat | null> {
  const pool = getDBPool();
  const query = 'SELECT * FROM products_vat WHERE "productId" = $1;';
  try {
    const result = await pool.query(query, [productId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching product VAT by ID ${productId}:`, error);
    throw error;
  }
}

export async function getAllProductsVat(): Promise<IProductVat[]> {
  const pool = getDBPool();
  const query = 'SELECT * FROM products_vat ORDER BY "productName";';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all products VAT:', error);
    throw error;
  }
}

export async function updateProductVat(productId: string, updateData: Partial<IProductVat>): Promise<IProductVat | null> {
  const pool = getDBPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  // Always update updatedDateTime
  updateData.updatedDateTime = new Date();

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'productId' && key !== 'createdDateTime') {
        setClauses.push(`"${key}" = $${valueCount++}`);
        values.push(value);
    }
  }

  if (setClauses.length === 0) return getProductVatById(productId); // No actual fields to update
  values.push(productId);

  const query = `
    UPDATE products_vat SET ${setClauses.join(', ')}
    WHERE "productId" = $${valueCount} RETURNING *;`;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating product VAT ID ${productId}:`, error);
    throw error;
  }
}

export async function deleteProductVat(productId: string): Promise<boolean> {
  const pool = getDBPool();
  const query = 'DELETE FROM products_vat WHERE "productId" = $1;';
  try {
    const result = await pool.query(query, [productId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting product VAT ID ${productId}:`, error);
    throw error;
  }
}

// --- Service functions for AccountSettings CRUD ---

export async function createAccountSetting(accountSettingData: IAccountSetting): Promise<IAccountSetting> {
  const pool = getDBPool();
  const {
    accountId,
    accountName,
    countryCode,
    currencyCode = null,
    defaultFulfilmentMethod = null,
    vatRegistrationNumber = null,
    createdDateTime = new Date(), // Will be overridden by DB default
    updatedDateTime = new Date(), // Will be overridden by DB default
    isActive = true,
  } = accountSettingData;

  const pCreatedDateTime = createdDateTime instanceof Date ? createdDateTime : new Date();
  const pUpdatedDateTime = updatedDateTime instanceof Date ? updatedDateTime : new Date();

  const query = `
    INSERT INTO account_settings (
      "accountId", "accountName", "countryCode", "currencyCode",
      "defaultFulfilmentMethod", "vatRegistrationNumber", "createdDateTime",
      "updatedDateTime", "isActive"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    accountId, accountName, countryCode, currencyCode,
    defaultFulfilmentMethod, vatRegistrationNumber, pCreatedDateTime,
    pUpdatedDateTime, isActive
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating account setting:', error);
    throw error;
  }
}

export async function getAccountSettingById(accountId: string): Promise<IAccountSetting | null> {
  const pool = getDBPool();
  const query = 'SELECT * FROM account_settings WHERE "accountId" = $1;';
  try {
    const result = await pool.query(query, [accountId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching account setting by ID ${accountId}:`, error);
    throw error;
  }
}

export async function getAllAccountSettings(): Promise<IAccountSetting[]> {
  const pool = getDBPool();
  const query = 'SELECT * FROM account_settings ORDER BY "accountName";';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all account settings:', error);
    throw error;
  }
}

export async function updateAccountSetting(accountId: string, updateData: Partial<IAccountSetting>): Promise<IAccountSetting | null> {
  const pool = getDBPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  // Always update updatedDateTime
  updateData.updatedDateTime = new Date();

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'accountId' && key !== 'createdDateTime') {
        setClauses.push(`"${key}" = $${valueCount++}`);
        values.push(value);
    }
  }

  if (setClauses.length === 0) return getAccountSettingById(accountId);
  values.push(accountId);

  const query = `
    UPDATE account_settings SET ${setClauses.join(', ')}
    WHERE "accountId" = $${valueCount} RETURNING *;`;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating account setting ID ${accountId}:`, error);
    throw error;
  }
}

export async function deleteAccountSetting(accountId: string): Promise<boolean> {
  const pool = getDBPool();
  const query = 'DELETE FROM account_settings WHERE "accountId" = $1;';
  try {
    const result = await pool.query(query, [accountId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting account setting ID ${accountId}:`, error);
    throw error;
  }
}
