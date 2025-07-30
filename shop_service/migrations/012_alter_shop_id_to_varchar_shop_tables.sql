
-- Migration to change shop_id to VARCHAR for string-based shop IDs in shop-related tables

-- Step 1: Update products table
ALTER TABLE products ALTER COLUMN shop_id TYPE VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
COMMENT ON COLUMN products.shop_id IS 'String ID of the shop that owns this product';

-- Step 2: Update offers table
ALTER TABLE offers ALTER COLUMN shop_id TYPE VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_offers_shop_id ON offers(shop_id);
COMMENT ON COLUMN offers.shop_id IS 'String ID of the shop that owns this offer';

-- Step 3: Update orders table
ALTER TABLE orders ALTER COLUMN shop_id TYPE VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
COMMENT ON COLUMN orders.shop_id IS 'String ID of the shop that owns this order';

-- Step 4: Update order_items table
ALTER TABLE order_items ALTER COLUMN shop_id TYPE VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_order_items_shop_id ON order_items(shop_id);
COMMENT ON COLUMN order_items.shop_id IS 'String ID of the shop that owns this order item';

-- Step 5: Update product_vat_rates table
ALTER TABLE product_vat_rates ALTER COLUMN shop_id TYPE VARCHAR(255);
ALTER TABLE product_vat_rates DROP CONSTRAINT IF EXISTS product_vat_rates_pkey;
ALTER TABLE product_vat_rates ADD CONSTRAINT product_vat_rates_pkey PRIMARY KEY (ean, country, shop_id);
CREATE INDEX IF NOT EXISTS idx_product_vat_rates_shop_id ON product_vat_rates(shop_id);
COMMENT ON COLUMN product_vat_rates.shop_id IS 'String ID of the shop that owns this VAT rate';
