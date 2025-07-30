-- Migration to add unique constraint on (ean, shop_id) for products table
-- This is needed for the ON CONFLICT clause in createProduct function

-- Drop the existing primary key constraint on ean
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_pkey;

-- Add unique constraint on (ean, shop_id)
ALTER TABLE products ADD CONSTRAINT products_ean_shop_id_unique UNIQUE (ean, shop_id);

-- Add a new primary key constraint on (ean, shop_id)
ALTER TABLE products ADD CONSTRAINT products_pkey PRIMARY KEY (ean, shop_id);

-- Add comment for documentation
COMMENT ON CONSTRAINT products_ean_shop_id_unique ON products IS 'Unique constraint on EAN and shop_id combination for multi-shop product support'; 