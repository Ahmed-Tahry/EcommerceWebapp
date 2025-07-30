-- Migration to fix all foreign key constraints that reference shops table

-- Fix user_onboarding_status foreign key constraint
ALTER TABLE user_onboarding_status DROP CONSTRAINT IF EXISTS fk_user_onboarding_status_shop_id;
ALTER TABLE user_onboarding_status 
  ADD CONSTRAINT fk_user_onboarding_status_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

-- Fix general_settings foreign key constraint
ALTER TABLE general_settings DROP CONSTRAINT IF EXISTS fk_general_settings_shop_id;
ALTER TABLE general_settings 
  ADD CONSTRAINT fk_general_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

-- Fix invoice_settings foreign key constraint
ALTER TABLE invoice_settings DROP CONSTRAINT IF EXISTS fk_invoice_settings_shop_id;
ALTER TABLE invoice_settings 
  ADD CONSTRAINT fk_invoice_settings_shop_id 
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE;

-- Add comments for documentation
COMMENT ON CONSTRAINT fk_user_onboarding_status_shop_id ON user_onboarding_status IS 'Foreign key constraint linking user_onboarding_status.shop_id to shops.shop_id';
COMMENT ON CONSTRAINT fk_general_settings_shop_id ON general_settings IS 'Foreign key constraint linking general_settings.shop_id to shops.shop_id';
COMMENT ON CONSTRAINT fk_invoice_settings_shop_id ON invoice_settings IS 'Foreign key constraint linking invoice_settings.shop_id to shops.shop_id'; 