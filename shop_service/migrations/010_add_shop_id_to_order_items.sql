-- Migration to add shop_id to order_items table for multi-shop support

-- Add shop_id column to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS shop_id INTEGER;



-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_items_shop_id ON order_items(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN order_items.shop_id IS 'ID of the shop that owns this order item';