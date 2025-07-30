-- Migration to add unique constraint on (user_id, shop_id) for account_details table

-- Add unique constraint on the combination of user_id and shop_id
ALTER TABLE account_details ADD CONSTRAINT account_details_user_id_shop_id_unique UNIQUE (user_id, shop_id);

-- Add comment for documentation
COMMENT ON CONSTRAINT account_details_user_id_shop_id_unique ON account_details IS 'Ensures each user can have only one account detail record per shop'; 