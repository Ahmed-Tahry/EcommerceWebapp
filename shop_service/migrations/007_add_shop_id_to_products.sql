-- Migration to add shop_id to products table for multi-shop support

-- Add shop_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS shop_id INTEGER;



-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN products.shop_id IS 'ID of the shop that owns this product';