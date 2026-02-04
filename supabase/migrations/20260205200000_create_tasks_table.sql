-- Task priority enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  offer_line_item_id UUID REFERENCES offer_line_items(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  column_id UUID NOT NULL REFERENCES task_board_columns(id) ON DELETE RESTRICT,

  -- Task details
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority NOT NULL DEFAULT 'medium',

  -- Dates
  due_date DATE,
  target_completion_date DATE,

  -- Time tracking
  hours_estimated NUMERIC(8,2) DEFAULT 0,
  hours_actual NUMERIC(8,2) DEFAULT 0,

  -- Additional tracking
  revision_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_offer_id ON tasks(offer_id);
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_service_id ON tasks(service_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();

-- RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
