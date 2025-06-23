-- Migration to create products_vat and account_settings tables

-- Drop tables if they exist (for easier re-running during development)
DROP TABLE IF EXISTS products_vat CASCADE;
DROP TABLE IF EXISTS account_settings CASCADE;

-- Create products_vat table
CREATE TABLE products_vat (
    "productId" TEXT PRIMARY KEY,
    ean TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "basePrice" DECIMAL,
    "vatRate" DECIMAL NOT NULL,
    "vatCategory" TEXT,
    "countryCode" TEXT NOT NULL,
    "isCompound" BOOLEAN DEFAULT FALSE,
    "appliesToShipping" BOOLEAN DEFAULT FALSE,
    "createdDateTime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDateTime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN DEFAULT TRUE
);

-- Create account_settings table
CREATE TABLE account_settings (
    "accountId" TEXT PRIMARY KEY,
    "accountName" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "currencyCode" TEXT,
    "defaultFulfilmentMethod" TEXT,
    "vatRegistrationNumber" TEXT,
    "createdDateTime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDateTime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN DEFAULT TRUE
);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_products_vat_ean ON products_vat(ean);
CREATE INDEX IF NOT EXISTS idx_products_vat_country_code ON products_vat("countryCode");
CREATE INDEX IF NOT EXISTS idx_account_settings_country_code ON account_settings("countryCode");

COMMENT ON COLUMN products_vat."basePrice" IS 'Price excluding VAT';
COMMENT ON COLUMN products_vat."vatRate" IS 'Percentage like 21.00 for 21% VAT';
COMMENT ON COLUMN products_vat."vatCategory" IS 'e.g., ‘Standard’, ‘Reduced’, ‘Exempt’';
COMMENT ON COLUMN products_vat."countryCode" IS 'e.g., ISO country code like ‘NL’ or ‘DE’ for VAT jurisdiction';
COMMENT ON COLUMN products_vat."isCompound" IS 'Indicates if VAT is applied on top of other taxes';
COMMENT ON COLUMN products_vat."appliesToShipping" IS 'Indicates if VAT applies to shipping costs';
COMMENT ON COLUMN products_vat."isActive" IS 'Indicates if the product is available for sale';

COMMENT ON COLUMN account_settings."countryCode" IS 'Links to products_vat.countryCode for tax settings';
COMMENT ON COLUMN account_settings."currencyCode" IS 'e.g., ‘EUR’, ‘USD’, for pricing';
COMMENT ON COLUMN account_settings."defaultFulfilmentMethod" IS 'e.g., ‘FBB’ or ‘FBA’';
COMMENT ON COLUMN account_settings."vatRegistrationNumber" IS 'For VAT compliance';
COMMENT ON COLUMN account_settings."isActive" IS 'Indicates if the account is active';
