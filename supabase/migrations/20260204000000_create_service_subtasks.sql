-- Create service_subtasks table
CREATE TABLE service_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_subtasks ENABLE ROW LEVEL SECURITY;

-- RLS policy - allow all for authenticated users
CREATE POLICY "Allow all for authenticated users" ON service_subtasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Add default subtasks for existing services (service name as subtask, 100%)
INSERT INTO service_subtasks (service_id, title, percentage, sort_order)
SELECT id, name, 100, 0 FROM services;

-- Create index for faster lookups by service_id
CREATE INDEX idx_service_subtasks_service_id ON service_subtasks(service_id);
