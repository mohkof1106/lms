-- Junction table for subtask assignees (assignees at subtask level, not task level)
CREATE TABLE task_subtask_assignees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_subtask_id UUID NOT NULL REFERENCES task_subtasks(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(task_subtask_id, employee_id)
);

-- Indexes
CREATE INDEX idx_task_subtask_assignees_subtask_id ON task_subtask_assignees(task_subtask_id);
CREATE INDEX idx_task_subtask_assignees_employee_id ON task_subtask_assignees(employee_id);

-- RLS
ALTER TABLE task_subtask_assignees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON task_subtask_assignees FOR ALL TO authenticated USING (true) WITH CHECK (true);
