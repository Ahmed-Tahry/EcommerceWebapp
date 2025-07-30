-- Migration to add shop_id to invoice_settings table for multi-shop support

-- Add shop_id column to invoice_settings table
ALTER TABLE invoice_settings ADD COLUMN IF NOT EXISTS shop_id INTEGER;

-- Add foreign key constraint
ALTER TABLE invoice_settings ADD CONSTRAINT fk_invoice_settings_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Change the primary key to be shop_id instead of user_id
ALTER TABLE invoice_settings DROP CONSTRAINT IF EXISTS invoice_settings_pkey;
ALTER TABLE invoice_settings ADD CONSTRAINT invoice_settings_pkey PRIMARY KEY (shop_id);

-- Remove the index on user_id and add one on shop_id
DROP INDEX IF EXISTS idx_invoice_settings_user_id;
CREATE INDEX IF NOT EXISTS idx_invoice_settings_shop_id ON invoice_settings(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN invoice_settings.shop_id IS 'ID of the shop that owns these invoice settings';