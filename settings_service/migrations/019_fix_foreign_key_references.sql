-- Migration to fix foreign key references to use shop_id instead of id

BEGIN;

-- 1. Drop all existing foreign key constraints
ALTER TABLE general_settings DROP CONSTRAINT IF EXISTS fk_general_settings_shop_id;
ALTER TABLE invoice_settings DROP CONSTRAINT IF EXISTS fk_invoice_settings_shop_id;
ALTER TABLE user_onboarding_status DROP CONSTRAINT IF EXISTS fk_user_onboarding_status_shop_id;
ALTER TABLE account_details DROP CONSTRAINT IF EXISTS fk_account_details_shop_id;

-- 2. Add correct foreign key constraints that reference shop_id (not id)
ALTER TABLE general_settings 
  ADD CONSTRAINT fk_general_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

ALTER TABLE invoice_settings 
  ADD CONSTRAINT fk_invoice_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

ALTER TABLE user_onboarding_status 
  ADD CONSTRAINT fk_user_onboarding_status_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

ALTER TABLE account_details 
  ADD CONSTRAINT fk_account_details_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

-- 3. Add unique constraint on shops.shop_id to ensure it can be referenced (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'shops_shop_id_unique'
    ) THEN
        ALTER TABLE shops ADD CONSTRAINT shops_shop_id_unique UNIQUE (shop_id);
    END IF;
END $$;

COMMIT; 