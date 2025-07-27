-- Migration to create product_vat_rates table for per-country VAT rates

CREATE TABLE IF NOT EXISTS product_vat_rates (
  ean VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  vat_rate NUMERIC(5,2) NOT NULL,
  PRIMARY KEY (ean, country)
);

CREATE INDEX IF NOT EXISTS idx_product_vat_rates_ean ON product_vat_rates(ean);
CREATE INDEX IF NOT EXISTS idx_product_vat_rates_country ON product_vat_rates(country);

COMMENT ON TABLE product_vat_rates IS 'Stores VAT rates per product (EAN) and country.';
COMMENT ON COLUMN product_vat_rates.ean IS 'European Article Number, unique identifier for the product.';
COMMENT ON COLUMN product_vat_rates.country IS 'Country for VAT rate application.';
COMMENT ON COLUMN product_vat_rates.vat_rate IS 'VAT rate for the product in the given country.'; 