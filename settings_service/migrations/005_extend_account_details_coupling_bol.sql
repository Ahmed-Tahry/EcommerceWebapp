-- Migration to extend account_details for Coupling Bol section

ALTER TABLE account_details
  ADD COLUMN IF NOT EXISTS sales_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS status VARCHAR(50),
  ADD COLUMN IF NOT EXISTS api_credentials JSONB;

COMMENT ON COLUMN account_details.sales_number IS 'Bol.com sales number for the user/company';
COMMENT ON COLUMN account_details.status IS 'Status of the Bol.com account link (e.g., Active, Inactive)';
COMMENT ON COLUMN account_details.api_credentials IS 'Optional object for storing access/refresh tokens or other API credentials.'; 