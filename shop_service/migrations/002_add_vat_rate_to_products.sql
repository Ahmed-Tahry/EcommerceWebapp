-- Add vat_rate column to products table
ALTER TABLE products
ADD COLUMN vat_rate NUMERIC(5, 2) DEFAULT NULL;

-- It's good practice to comment your migrations
-- This migration adds a nullable vat_rate column to store VAT percentages
-- for products. Example: 21.00 for 21% VAT.
-- A NUMERIC(5, 2) type can store numbers up to 999.99.
