-- Create service_categories table
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case-insensitive unique constraint on name
CREATE UNIQUE INDEX idx_service_categories_name_ci ON service_categories (LOWER(name));

-- Seed existing categories (mapping from enum values)
INSERT INTO service_categories (name, sort_order) VALUES
  ('Power Point', 1),
  ('Video', 2),
  ('Branding', 3);

-- Add category_id foreign key to services table
ALTER TABLE services ADD COLUMN category_id UUID REFERENCES service_categories(id);

-- Populate category_id based on existing enum values
UPDATE services SET category_id = (
  SELECT id FROM service_categories WHERE LOWER(name) =
    CASE services.category::text
      WHEN 'powerpoint' THEN 'power point'
      WHEN 'video' THEN 'video'
      WHEN 'branding' THEN 'branding'
    END
);

-- Make category_id NOT NULL after population
ALTER TABLE services ALTER COLUMN category_id SET NOT NULL;

-- Enable RLS on service_categories
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated" ON service_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_services_category_id ON services(category_id);
