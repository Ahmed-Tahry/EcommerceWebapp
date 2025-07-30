-- Migration to add shop_id to orders table for multi-shop support

-- Add shop_id column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shop_id INTEGER;


-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN orders.shop_id IS 'ID of the shop that owns this order';