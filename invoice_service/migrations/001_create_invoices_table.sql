-- Migration: 001_create_invoices_table.sql
-- Description: Creates the main invoices table to store invoice records.

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,                                      -- Unique identifier for the invoice
    shop_id INTEGER NOT NULL,                                   -- Identifier for the shop/seller this invoice belongs to (references a shop table in another service or a local representation)
    order_id VARCHAR(255) NOT NULL,                             -- Bol.com order ID or an internal system order ID that maps to it. Consider uniqueness based on shop_id + order_id if order_id alone isn't globally unique.
    bol_order_id VARCHAR(255) UNIQUE,                           -- Explicit Bol.com order ID from the platform, if different from `order_id`. Marked UNIQUE if it should be.
    customer_name VARCHAR(255),                                 -- Customer's full name
    customer_email VARCHAR(255),                                -- Customer's email address
    billing_address JSONB,                                      -- Customer's billing address (structured JSON)
    shipping_address JSONB,                                     -- Customer's shipping address (structured JSON)
    invoice_number VARCHAR(100) UNIQUE NOT NULL,                -- Unique invoice number (e.g., INV-2023-0001). Consider per-shop uniqueness if needed.
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,            -- Date the invoice was issued
    due_date DATE,                                              -- Date the invoice is due
    subtotal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,       -- Total amount before taxes and discounts
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,                     -- Total tax amount
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,                -- Total discount amount
    total_amount DECIMAL(12, 2) NOT NULL,                       -- Final total amount of the invoice (subtotal + tax - discount)
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',                 -- Currency code (e.g., EUR)
    status VARCHAR(50) NOT NULL DEFAULT 'draft',                -- Invoice status (e.g., 'draft', 'sent', 'paid', 'overdue', 'cancelled', 'void')
    payment_method VARCHAR(100),                                -- Payment method used or expected
    notes TEXT,                                                 -- Any additional notes for the customer or internal use
    bol_order_data JSONB,                                       -- Store raw Bol.com order data for reference or future use
    pdf_url TEXT,                                               -- URL to the generated PDF of the invoice, if applicable
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_shop_order UNIQUE (shop_id, order_id)         -- Ensures order_id is unique per shop
);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_invoices_shop_id ON invoices(shop_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number); -- Already unique, but index helps lookups

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoices_updated_at') THEN
        CREATE TRIGGER update_invoices_updated_at
            BEFORE UPDATE
            ON invoices
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

COMMENT ON TABLE invoices IS 'Stores invoice records, linked to Bol.com orders.';
COMMENT ON COLUMN invoices.shop_id IS 'Identifier for the shop/seller this invoice belongs to.';
COMMENT ON COLUMN invoices.order_id IS 'Internal or Bol.com Order ID. Unique in combination with shop_id.';
COMMENT ON COLUMN invoices.bol_order_id IS 'Explicit Bol.com order ID from the platform, can be used for direct reference. Should be unique if used as a primary lookup key.';
COMMENT ON COLUMN invoices.invoice_number IS 'System-generated unique invoice number.';
COMMENT ON COLUMN invoices.status IS 'Current status of the invoice (e.g., draft, sent, paid, overdue, cancelled).';
COMMENT ON COLUMN invoices.bol_order_data IS 'Raw JSON data of the order from Bol.com for auditing or detailed views.';
COMMENT ON COLUMN invoices.billing_address IS 'Billing address in JSON format, e.g., {"street": "123 Main St", "city": "Anytown", "zip": "12345", "country": "NL"}.';
COMMENT ON COLUMN invoices.shipping_address IS 'Shipping address in JSON format.';
COMMENT ON COLUMN invoices.pdf_url IS 'Link to the stored PDF version of the invoice.';
