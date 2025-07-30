-- Migration to add shop_id to general_settings table for multi-shop support

-- Add shop_id column to general_settings table
ALTER TABLE general_settings ADD COLUMN IF NOT EXISTS shop_id INTEGER;

-- Add foreign key constraint
ALTER TABLE general_settings ADD CONSTRAINT fk_general_settings_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Change the primary key to be shop_id instead of user_id
ALTER TABLE general_settings DROP CONSTRAINT IF EXISTS general_settings_pkey;
ALTER TABLE general_settings ADD CONSTRAINT general_settings_pkey PRIMARY KEY (shop_id);

-- Remove the index on user_id and add one on shop_id
DROP INDEX IF EXISTS idx_general_settings_user_id;
CREATE INDEX IF NOT EXISTS idx_general_settings_shop_id ON general_settings(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN general_settings.shop_id IS 'ID of the shop that owns these general settings';