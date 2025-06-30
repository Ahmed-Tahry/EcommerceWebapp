-- Migration to create the products table

CREATE TABLE IF NOT EXISTS products (
    ean VARCHAR(255) PRIMARY KEY,
    title TEXT,
    description TEXT,
    brand VARCHAR(255),
    "mainImageUrl" TEXT,          -- Quoted for camelCase
    attributes JSONB,             -- For flexible key-value attributes
    "lastSyncFromBol" TIMESTAMP,  -- Quoted for camelCase
    "lastSyncToBol" TIMESTAMP,    -- Quoted for camelCase
    vat_rate NUMERIC(5, 2)        -- Added directly here, assuming this migration runs after 001
);

-- Add an index on ean as it's the PK, though usually created automatically.
-- Explicitly adding for clarity or if specific index types were needed later.
CREATE INDEX IF NOT EXISTS idx_products_ean ON products(ean);

COMMENT ON TABLE products IS 'Stores product information, including details synced from external sources like Bol.com and manually set VAT rates.';
COMMENT ON COLUMN products.ean IS 'European Article Number, unique identifier for the product.';
COMMENT ON COLUMN products.title IS 'Title of the product.';
COMMENT ON COLUMN products.description IS 'Description of the product.';
COMMENT ON COLUMN products.brand IS 'Brand of the product.';
COMMENT ON COLUMN products."mainImageUrl" IS 'URL of the main image for the product.';
COMMENT ON COLUMN products.attributes IS 'Flexible JSONB field to store additional product attributes.';
COMMENT ON COLUMN products."lastSyncFromBol" IS 'Timestamp of the last successful data synchronization from Bol.com for this product.';
COMMENT ON COLUMN products."lastSyncToBol" IS 'Timestamp of the last successful data push to Bol.com for this product.';
COMMENT ON COLUMN products.vat_rate IS 'VAT rate for the product, e.g., 21.00 for 21%. Can be updated manually.';
