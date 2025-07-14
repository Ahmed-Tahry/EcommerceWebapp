-- Migration to create the correct settings tables

-- Drop tables if they exist (for easier re-running during development)
DROP TABLE IF EXISTS vat_settings CASCADE;
DROP TABLE IF EXISTS account_details CASCADE;
DROP TABLE IF EXISTS user_onboarding_status CASCADE;
DROP TABLE IF EXISTS invoice_settings CASCADE;

-- Create account_details table (per-user Bol.com credentials)
CREATE TABLE account_details (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    bol_client_id VARCHAR(255),
    bol_client_secret VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create user_onboarding_status table
CREATE TABLE user_onboarding_status (
    user_id VARCHAR(255) PRIMARY KEY,
    has_configured_bol_api BOOLEAN DEFAULT FALSE,
    has_completed_shop_sync BOOLEAN DEFAULT FALSE,
    has_completed_vat_setup BOOLEAN DEFAULT FALSE,
    has_completed_invoice_setup BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create vat_settings table (system-wide VAT configurations)
CREATE TABLE vat_settings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rate NUMERIC(5, 2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice_settings table (per-user invoice configurations)
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

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_account_details_user_id ON account_details(user_id);
CREATE INDEX IF NOT EXISTS idx_vat_settings_is_default ON vat_settings(is_default);
CREATE INDEX IF NOT EXISTS idx_vat_settings_rate ON vat_settings(rate);
CREATE INDEX IF NOT EXISTS idx_invoice_settings_user_id ON invoice_settings(user_id);

-- Add comments for documentation
COMMENT ON TABLE account_details IS 'Stores Bol.com API credentials per user';
COMMENT ON TABLE user_onboarding_status IS 'Tracks user onboarding progress';
COMMENT ON TABLE vat_settings IS 'System-wide VAT rate configurations';
COMMENT ON TABLE invoice_settings IS 'Per-user invoice settings';
