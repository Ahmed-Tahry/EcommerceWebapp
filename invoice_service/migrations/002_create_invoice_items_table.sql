-- Migration: 002_create_invoice_items_table.sql
-- Description: Creates the invoice_items table to store line items for each invoice.

CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,                                      -- Unique identifier for the invoice item
    invoice_id INTEGER NOT NULL,                                -- Foreign key referencing the invoices table
    bol_product_id VARCHAR(255),                                -- Bol.com product identifier (EAN or other)
    product_title TEXT NOT NULL,                                -- Product name or description
    sku VARCHAR(100),                                           -- Stock Keeping Unit, if applicable
    quantity INTEGER NOT NULL CHECK (quantity > 0),             -- Number of units for this item
    unit_price DECIMAL(10, 2) NOT NULL,                         -- Price per unit
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,                        -- Tax rate applied to this item (e.g., 21.00 for 21%)
    tax_amount_per_unit DECIMAL(10, 2) DEFAULT 0.00,            -- Tax amount for a single unit of this item
    total_price_exclusive_tax DECIMAL(12, 2) NOT NULL,          -- Total price for this line item excluding tax (quantity * unit_price)
    total_tax_amount DECIMAL(12, 2) DEFAULT 0.00,               -- Total tax amount for this line item (quantity * tax_amount_per_unit)
    total_price_inclusive_tax DECIMAL(12, 2) NOT NULL,          -- Total price for this line item including tax
    notes TEXT,                                                 -- Any specific notes for this line item
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_invoice
        FOREIGN KEY(invoice_id)
        REFERENCES invoices(id)
        ON DELETE CASCADE -- If an invoice is deleted, its items are also deleted
);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_bol_product_id ON invoice_items(bol_product_id);

-- Trigger to update updated_at timestamp
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoice_items_updated_at') THEN
        CREATE TRIGGER update_invoice_items_updated_at
            BEFORE UPDATE
            ON invoice_items
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column(); -- Assumes update_updated_at_column function is created by 001 migration
    END IF;
END $$;

COMMENT ON TABLE invoice_items IS 'Stores individual line items for each invoice.';
COMMENT ON COLUMN invoice_items.invoice_id IS 'References the parent invoice.';
COMMENT ON COLUMN invoice_items.bol_product_id IS 'The Bol.com identifier for the product (e.g., EAN).';
COMMENT ON COLUMN invoice_items.tax_rate IS 'The tax rate (e.g., 21.00 for 21%) applied to this item.';
COMMENT ON COLUMN invoice_items.total_price_exclusive_tax IS 'Total for this line item before tax.';
COMMENT ON COLUMN invoice_items.total_tax_amount IS 'Total tax for this line item.';
COMMENT ON COLUMN invoice_items.total_price_inclusive_tax IS 'Total for this line item after tax.';
