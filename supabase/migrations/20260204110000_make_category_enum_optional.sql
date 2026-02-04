-- Make the legacy category enum column optional
-- The actual category is determined by category_id FK to service_categories table
ALTER TABLE services
  ALTER COLUMN category DROP NOT NULL;

-- Set default value for new inserts
ALTER TABLE services
  ALTER COLUMN category SET DEFAULT 'branding'::service_category;
