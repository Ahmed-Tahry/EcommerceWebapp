-- Migration: 003_add_bol_upload_status_to_invoices.sql
-- Description: Adds columns to track the status of invoice uploads to Bol.com.

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS bol_invoice_upload_status VARCHAR(50) DEFAULT 'NOT_ATTEMPTED', -- e.g., 'NOT_ATTEMPTED', 'PENDING', 'SUCCESS', 'FAILED'
ADD COLUMN IF NOT EXISTS bol_invoice_uploaded_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN IF NOT EXISTS bol_invoice_upload_details TEXT NULL;

COMMENT ON COLUMN invoices.bol_invoice_upload_status IS 'Status of the invoice upload to Bol.com.';
COMMENT ON COLUMN invoices.bol_invoice_uploaded_at IS 'Timestamp when the invoice was successfully uploaded to Bol.com.';
COMMENT ON COLUMN invoices.bol_invoice_upload_details IS 'Details or error messages related to the Bol.com invoice upload attempt.';
