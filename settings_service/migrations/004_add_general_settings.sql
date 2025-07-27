-- Migration to add general_settings table for user profile and company info

CREATE TABLE IF NOT EXISTS general_settings (
    user_id VARCHAR(255) PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_general_settings_user_id ON general_settings(user_id);

COMMENT ON TABLE general_settings IS 'Stores all personal, company, and additional company info for user settings.'; 