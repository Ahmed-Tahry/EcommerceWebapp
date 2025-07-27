-- Migration to add country column to products table for VAT country tracking

ALTER TABLE products ADD COLUMN IF NOT EXISTS country VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_products_country ON products(country);

COMMENT ON COLUMN products.country IS 'Country for VAT rate application (e.g., Netherlands, Germany, France).'; 