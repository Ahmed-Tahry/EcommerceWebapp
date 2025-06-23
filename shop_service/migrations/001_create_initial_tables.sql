-- Migration to create initial tables: offers, orders, and order_items

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
    "offerId" VARCHAR(255) PRIMARY KEY,
    ean VARCHAR(255) NOT NULL,
    "conditionName" VARCHAR(255),
    "conditionCategory" VARCHAR(255),
    "conditionComment" TEXT,
    "bundlePricesPrice" DECIMAL,
    "fulfilmentDeliveryCode" VARCHAR(255),
    "stockAmount" INTEGER,
    "onHoldByRetailer" BOOLEAN,
    "fulfilmentType" VARCHAR(255),
    "mutationDateTime" TIMESTAMP,
    "referenceCode" VARCHAR(255),
    "correctedStock" INTEGER
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    "orderId" VARCHAR(255) PRIMARY KEY,
    "orderPlacedDateTime" TIMESTAMP NOT NULL,
    "orderItems" JSONB
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    "orderItemId" VARCHAR(255) PRIMARY KEY,
    "orderId" VARCHAR(255) NOT NULL REFERENCES orders("orderId") ON DELETE CASCADE,
    ean VARCHAR(255) NOT NULL,
    "fulfilmentMethod" VARCHAR(255),
    "fulfilmentStatus" VARCHAR(255),
    quantity INTEGER,
    "quantityShipped" INTEGER,
    "quantityCancelled" INTEGER,
    "cancellationRequest" BOOLEAN,
    "latestChangedDateTime" TIMESTAMP
);

-- Add indexes for frequently queried columns (optional, but good practice)
CREATE INDEX IF NOT EXISTS idx_offers_ean ON offers(ean);
CREATE INDEX IF NOT EXISTS idx_order_items_orderId ON order_items("orderId");
CREATE INDEX IF NOT EXISTS idx_order_items_ean ON order_items(ean);
