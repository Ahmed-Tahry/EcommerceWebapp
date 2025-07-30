-- Migration to fix the foreign key constraint for account_details table

-- Step 1: Add unique constraint on shop_id in shops table FIRST
-- Drop the constraint first if it exists to avoid errors
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shops_shop_id_unique') THEN
        ALTER TABLE shops DROP CONSTRAINT shops_shop_id_unique;
    END IF;
END $$;

ALTER TABLE shops ADD CONSTRAINT shops_shop_id_unique UNIQUE (shop_id);

-- Step 2: Drop the existing foreign key constraint
ALTER TABLE account_details DROP CONSTRAINT IF EXISTS fk_account_details_shop_id;

-- Step 3: Add the correct foreign key constraint that references shop_id instead of id
ALTER TABLE account_details 
  ADD CONSTRAINT fk_account_details_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

-- Add comments for documentation
COMMENT ON CONSTRAINT shops_shop_id_unique ON shops IS 'Ensures each shop_id is unique across all shops';
COMMENT ON CONSTRAINT fk_account_details_shop_id ON account_details IS 'Foreign key constraint linking account_details.shop_id to shops.shop_id'; 