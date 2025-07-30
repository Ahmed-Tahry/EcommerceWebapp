-- Migration to add shop_id to user_onboarding_status table for multi-shop support

-- Add shop_id column to user_onboarding_status table
ALTER TABLE user_onboarding_status ADD COLUMN IF NOT EXISTS shop_id INTEGER;

-- Add foreign key constraint
ALTER TABLE user_onboarding_status ADD CONSTRAINT fk_user_onboarding_status_shop_id FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Change the primary key to be a composite of user_id and shop_id
ALTER TABLE user_onboarding_status DROP CONSTRAINT IF EXISTS user_onboarding_status_pkey;
ALTER TABLE user_onboarding_status ADD CONSTRAINT user_onboarding_status_pkey PRIMARY KEY (user_id, shop_id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_onboarding_status_shop_id ON user_onboarding_status(shop_id);

-- Add comment for documentation
COMMENT ON COLUMN user_onboarding_status.shop_id IS 'ID of the shop that owns this onboarding status';