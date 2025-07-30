-- Migration to create the shops table for multi-shop support

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    shop_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);

-- Add comments for documentation
COMMENT ON TABLE shops IS 'Stores shop information for multi-shop support';
COMMENT ON COLUMN shops.user_id IS 'ID of the user who owns this shop';
COMMENT ON COLUMN shops.name IS 'Name of the shop';
COMMENT ON COLUMN shops.description IS 'Description of the shop';