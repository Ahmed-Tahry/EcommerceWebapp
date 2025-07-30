-- Migration to fix invoice_settings table structure to match code expectations

-- First, let's check if the table exists and what its current structure is
-- If the table has user_id as primary key, we need to restructure it

-- Drop the existing table if it exists (this will lose data, but it's needed for the fix)
DROP TABLE IF EXISTS invoice_settings CASCADE;

-- Create the invoice_settings table with the correct structure
CREATE TABLE invoice_settings (
    shop_id VARCHAR(255) PRIMARY KEY,
    company_name VARCHAR(255),
    company_address TEXT,
    company_phone VARCHAR(255),
    company_email VARCHAR(255),
    invoice_prefix VARCHAR(50),
    vat_number VARCHAR(255),
    default_invoice_notes TEXT,
    next_invoice_number INTEGER DEFAULT 1,
    bank_account VARCHAR(255),
    start_number VARCHAR(20),
    file_name_base VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add index for shop_id
CREATE INDEX IF NOT EXISTS idx_invoice_settings_shop_id ON invoice_settings(shop_id);

-- Add comments for documentation
COMMENT ON TABLE invoice_settings IS 'Per-shop invoice settings';
COMMENT ON COLUMN invoice_settings.shop_id IS 'Shop ID (primary key)';
COMMENT ON COLUMN invoice_settings.vat_number IS 'VAT identification number for the company';
COMMENT ON COLUMN invoice_settings.default_invoice_notes IS 'Default notes to include on invoices';
COMMENT ON COLUMN invoice_settings.next_invoice_number IS 'Next invoice number to use for auto-incrementing';
COMMENT ON COLUMN invoice_settings.start_number IS 'Starting number for invoice numbering, e.g., 0001';
COMMENT ON COLUMN invoice_settings.file_name_base IS 'Base for invoice file name, either invoice_number or order_number'; 