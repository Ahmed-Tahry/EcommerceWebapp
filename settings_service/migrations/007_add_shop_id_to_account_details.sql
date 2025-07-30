-- Migration to add shop_id to account_details table for multi-shop support

-- Add shop_id column to account_details table
ALTER TABLE account_details ADD COLUMN IF NOT EXISTS shop_id INTEGER;

-- Add foreign key constraint
ALTER TABLE account_details ADD CONSTRAINT fk_account_details_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Remove the UNIQUE constraint on user_id since multiple shops can belong to the same user
ALTER TABLE account_details DROP CONSTRAINT IF EXISTS account_details_user_id_key;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_account_details_shop_id ON account_details(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN account_details.shop_id IS 'ID of the shop that owns these account details';