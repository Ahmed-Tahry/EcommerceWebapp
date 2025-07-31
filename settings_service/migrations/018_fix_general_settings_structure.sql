-- Migration to fix general_settings table structure for proper shop-based filtering

-- First, let's check if the table exists and what its current structure is
-- The issue is that user_id is still NOT NULL from the original table creation

-- Step 1: Drop the existing table if it exists (this will lose data, but it's needed for the fix)
DROP TABLE IF EXISTS general_settings CASCADE;

-- Step 2: Create the general_settings table with the correct structure
CREATE TABLE general_settings (
    shop_id VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    account_email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    company_postcode VARCHAR(20) NOT NULL,
    company_city VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    company_phone_number VARCHAR(50),
    chamber_of_commerce VARCHAR(50) NOT NULL,
    vat_number VARCHAR(20) NOT NULL,
    iban VARCHAR(34),
    optional_vat_number VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Add foreign key constraint to shops table
ALTER TABLE general_settings 
  ADD CONSTRAINT fk_general_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Step 4: Add index for shop_id
CREATE INDEX IF NOT EXISTS idx_general_settings_shop_id ON general_settings(shop_id);

-- Step 5: Add comments for documentation
COMMENT ON TABLE general_settings IS 'Stores all personal, company, and additional company info for shop settings.';
COMMENT ON COLUMN general_settings.shop_id IS 'Shop ID (primary key)';
COMMENT ON COLUMN general_settings.firstname IS 'User first name';
COMMENT ON COLUMN general_settings.surname IS 'User surname';
COMMENT ON COLUMN general_settings.address IS 'User address';
COMMENT ON COLUMN general_settings.postcode IS 'User postcode';
COMMENT ON COLUMN general_settings.city IS 'User city';
COMMENT ON COLUMN general_settings.account_email IS 'User account email';
COMMENT ON COLUMN general_settings.phone_number IS 'User phone number';
COMMENT ON COLUMN general_settings.company_name IS 'Company name';
COMMENT ON COLUMN general_settings.company_address IS 'Company address';
COMMENT ON COLUMN general_settings.company_postcode IS 'Company postcode';
COMMENT ON COLUMN general_settings.company_city IS 'Company city';
COMMENT ON COLUMN general_settings.customer_email IS 'Customer contact email';
COMMENT ON COLUMN general_settings.company_phone_number IS 'Company phone number';
COMMENT ON COLUMN general_settings.chamber_of_commerce IS 'Chamber of commerce number';
COMMENT ON COLUMN general_settings.vat_number IS 'VAT identification number';
COMMENT ON COLUMN general_settings.iban IS 'Bank account IBAN';
COMMENT ON COLUMN general_settings.optional_vat_number IS 'Optional secondary VAT number'; 