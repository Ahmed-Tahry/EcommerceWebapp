-- Migration to add userId to products table

ALTER TABLE products ADD COLUMN IF NOT EXISTS "userId" VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_products_userId ON products("userId");

COMMENT ON COLUMN products."userId" IS 'ID of the user/shop that owns this product.'; 