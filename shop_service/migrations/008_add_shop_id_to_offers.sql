-- Migration to add shop_id to offers table for multi-shop support

-- Add shop_id column to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS shop_id INTEGER;



-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_offers_shop_id ON offers(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN offers.shop_id IS 'ID of the shop that owns this offer';