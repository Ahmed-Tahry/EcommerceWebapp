-- Migration to fix invoice_settings table to be user-specific

-- Drop the old global invoice_settings table
DROP TABLE IF EXISTS invoice_settings;

-- Create new user-specific invoice_settings table
CREATE TABLE invoice_settings (
    user_id VARCHAR(255) PRIMARY KEY,
    company_name VARCHAR(255),
    company_address TEXT,
    company_phone VARCHAR(255),
    company_email VARCHAR(255),
    invoice_prefix VARCHAR(50),
    vat_number VARCHAR(255),
    default_invoice_notes TEXT,
    next_invoice_number INTEGER DEFAULT 1,
    bank_account VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add index for user_id
CREATE INDEX IF NOT EXISTS idx_invoice_settings_user_id ON invoice_settings(user_id);

-- Add comments for the columns
COMMENT ON TABLE invoice_settings IS 'Per-user invoice settings';
COMMENT ON COLUMN invoice_settings.user_id IS 'User ID (primary key)';
COMMENT ON COLUMN invoice_settings.vat_number IS 'VAT identification number for the company';
COMMENT ON COLUMN invoice_settings.default_invoice_notes IS 'Default notes to include on invoices';
COMMENT ON COLUMN invoice_settings.next_invoice_number IS 'Next invoice number to use for auto-incrementing'; 