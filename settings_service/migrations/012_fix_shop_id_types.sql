BEGIN;

-- 1. Drop all constraints first
ALTER TABLE general_settings DROP CONSTRAINT IF EXISTS fk_general_settings_shop_id;
ALTER TABLE invoice_settings DROP CONSTRAINT IF EXISTS fk_invoice_settings_shop_id;
ALTER TABLE user_onboarding_status DROP CONSTRAINT IF EXISTS fk_user_onboarding_status_shop_id;
ALTER TABLE account_details DROP CONSTRAINT IF EXISTS fk_account_details_shop_id;

-- 2. Convert shops.id to VARCHAR
ALTER TABLE shops ALTER COLUMN id TYPE VARCHAR(255);

-- 3. Ensure all shop_id columns are VARCHAR(255)
ALTER TABLE general_settings ALTER COLUMN shop_id TYPE VARCHAR(255);
ALTER TABLE invoice_settings ALTER COLUMN shop_id TYPE VARCHAR(255);
ALTER TABLE user_onboarding_status ALTER COLUMN shop_id TYPE VARCHAR(255);
ALTER TABLE account_details ALTER COLUMN shop_id TYPE VARCHAR(255);

-- 4. Recreate constraints
ALTER TABLE general_settings 
  ADD CONSTRAINT fk_general_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

ALTER TABLE invoice_settings 
  ADD CONSTRAINT fk_invoice_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

ALTER TABLE user_onboarding_status 
  ADD CONSTRAINT fk_user_onboarding_status_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

ALTER TABLE account_details 
  ADD CONSTRAINT fk_account_details_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

COMMIT;