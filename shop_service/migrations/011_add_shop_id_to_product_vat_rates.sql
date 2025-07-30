-- Migration to add shop_id to product_vat_rates table for multi-shop support

-- Add shop_id column to product_vat_rates table
ALTER TABLE product_vat_rates ADD COLUMN IF NOT EXISTS shop_id INTEGER;



-- Change the primary key to include shop_id
ALTER TABLE product_vat_rates DROP CONSTRAINT IF EXISTS product_vat_rates_pkey;
ALTER TABLE product_vat_rates ADD CONSTRAINT product_vat_rates_pkey PRIMARY KEY (ean, country, shop_id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_vat_rates_shop_id ON product_vat_rates(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN product_vat_rates.shop_id IS 'ID of the shop that owns this VAT rate';