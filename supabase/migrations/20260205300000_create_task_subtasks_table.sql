-- Task subtasks table (copied from service_subtasks when task created)
CREATE TABLE task_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

  -- Reference to original service subtask (optional)
  service_subtask_id UUID REFERENCES service_subtasks(id) ON DELETE SET NULL,

  -- Subtask details
  title TEXT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  hours_estimated NUMERIC(8,2) DEFAULT 0,
  hours_actual NUMERIC(8,2) DEFAULT 0,

  -- Dates
  target_date DATE,
  completed_at TIMESTAMPTZ,

  -- Status
  completed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_task_subtasks_task_id ON task_subtasks(task_id);
CREATE INDEX idx_task_subtasks_target_date ON task_subtasks(target_date);

-- Update timestamp trigger
CREATE TRIGGER trigger_task_subtasks_updated_at
  BEFORE UPDATE ON task_subtasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();

-- RLS
ALTER TABLE task_subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON task_subtasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
