-- Add working_days_per_week column to company_settings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_settings'
    AND column_name = 'working_days_per_week'
  ) THEN
    ALTER TABLE company_settings ADD COLUMN working_days_per_week INTEGER DEFAULT 5;
  END IF;
END $$;

-- Update existing rows to have a default value if NULL
UPDATE company_settings SET working_days_per_week = 5 WHERE working_days_per_week IS NULL;
