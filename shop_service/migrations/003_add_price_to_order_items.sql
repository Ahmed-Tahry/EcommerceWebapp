-- Migration: 003_add_price_to_order_items.sql
-- Description: Adds a column to store the VAT-inclusive unit price for order items.

ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS unit_price_inclusive_vat NUMERIC(10, 2) NULL;

COMMENT ON COLUMN order_items.unit_price_inclusive_vat IS 'Unit price of the item as obtained from the order source (e.g., Bol.com), assumed to be VAT-inclusive. Used for invoicing calculations.';
