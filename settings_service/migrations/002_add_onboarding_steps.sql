-- Add new columns for detailed onboarding steps to user_onboarding_status table
ALTER TABLE user_onboarding_status
ADD COLUMN has_completed_shop_sync BOOLEAN DEFAULT FALSE,
ADD COLUMN has_completed_vat_setup BOOLEAN DEFAULT FALSE,
ADD COLUMN has_completed_invoice_setup BOOLEAN DEFAULT FALSE;

-- Note: Existing rows will have NULL for these new columns if not for the DEFAULT FALSE.
-- If there's a need to update existing NULLs to FALSE (if default isn't applied retroactively by some DBs on ALTER),
-- an additional UPDATE statement might be needed, though PostgreSQL typically applies defaults.
-- Example: UPDATE user_onboarding_status SET has_completed_shop_sync = FALSE WHERE has_completed_shop_sync IS NULL;
-- (Repeat for other new columns if necessary)
