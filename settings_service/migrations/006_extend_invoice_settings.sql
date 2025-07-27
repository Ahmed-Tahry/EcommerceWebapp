-- Migration to extend invoice_settings for Invoice Settings section

ALTER TABLE invoice_settings
  ADD COLUMN IF NOT EXISTS start_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS file_name_base VARCHAR(50);
 
COMMENT ON COLUMN invoice_settings.start_number IS 'Starting number for invoice numbering, e.g., 0001';
COMMENT ON COLUMN invoice_settings.file_name_base IS 'Base for invoice file name, either invoice_number or order_number'; 