
-- -- Migration to change shop_id to VARCHAR for string-based shop IDs

-- -- Step 1: Update shops table to use VARCHAR for id (if not already)
-- ALTER TABLE shops ALTER COLUMN id TYPE VARCHAR(255);
-- ALTER TABLE shops ALTER COLUMN id SET NOT NULL;

-- -- Step 2: Update general_settings table
-- ALTER TABLE general_settings DROP CONSTRAINT IF EXISTS fk_general_settings_shop_id;
-- ALTER TABLE general_settings ALTER COLUMN shop_id TYPE VARCHAR(255);
-- ALTER TABLE general_settings ADD CONSTRAINT fk_general_settings_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;
-- ALTER TABLE general_settings DROP CONSTRAINT IF EXISTS general_settings_pkey;
-- ALTER TABLE general_settings ADD CONSTRAINT general_settings_pkey PRIMARY KEY (shop_id);
-- DROP INDEX IF EXISTS idx_general_settings_shop_id;
-- CREATE INDEX idx_general_settings_shop_id ON general_settings(shop_id);
-- COMMENT ON COLUMN general_settings.shop_id IS 'String ID of the shop that owns these general settings';

-- -- Step 3: Update invoice_settings table
-- ALTER TABLE invoice_settings DROP CONSTRAINT IF EXISTS fk_invoice_settings_shop_id;
-- ALTER TABLE invoice_settings ALTER COLUMN shop_id TYPE VARCHAR(255);
-- ALTER TABLE invoice_settings ADD CONSTRAINT fk_invoice_settings_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;
-- ALTER TABLE invoice_settings DROP CONSTRAINT IF EXISTS invoice_settings_pkey;
-- ALTER TABLE invoice_settings ADD CONSTRAINT invoice_settings_pkey PRIMARY KEY (shop_id);
-- DROP INDEX IF EXISTS idx_invoice_settings_shop_id;
-- CREATE INDEX idx_invoice_settings_shop_id ON invoice_settings(shop_id);
-- COMMENT ON COLUMN invoice_settings.shop_id IS 'String ID of the shop that owns these invoice settings';

-- -- Step 4: Update user_onboarding_status table
-- ALTER TABLE user_onboarding_status DROP CONSTRAINT IF EXISTS fk_user_onboarding_status_shop_id;
-- ALTER TABLE user_onboarding_status ALTER COLUMN shop_id TYPE VARCHAR(255);
-- ALTER TABLE user_onboarding_status ADD CONSTRAINT fk_user_onboarding_status_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;
-- ALTER TABLE user_onboarding_status DROP CONSTRAINT IF EXISTS user_onboarding_status_pkey;
-- ALTER TABLE user_onboarding_status ADD CONSTRAINT user_onboarding_status_pkey PRIMARY KEY (user_id, shop_id);
-- DROP INDEX IF EXISTS idx_user_onboarding_status_shop_id;
-- CREATE INDEX idx_user_onboarding_status_shop_id ON user_onboarding_status(shop_id);
-- COMMENT ON COLUMN user_onboarding_status.shop_id IS 'String ID of the shop that owns this onboarding status';

-- -- Step 5: Update account_details table
-- ALTER TABLE account_details DROP CONSTRAINT IF EXISTS fk_account_details_shop_id;
-- ALTER TABLE account_details ALTER COLUMN shop_id TYPE VARCHAR(255);
-- ALTER TABLE account_details ADD CONSTRAINT fk_account_details_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;
-- DROP INDEX IF EXISTS idx_account_details_shop_id;
-- CREATE INDEX idx_account_details_shop_id ON account_details(shop_id);
-- COMMENT ON COLUMN account_details.shop_id IS 'String ID of the shop that owns these account details';
