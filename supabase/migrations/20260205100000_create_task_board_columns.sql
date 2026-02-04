-- Task board columns for Kanban workflow
CREATE TABLE task_board_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default columns
INSERT INTO task_board_columns (name, color, sort_order, is_system) VALUES
  ('Backlog', '#64748b', 0, true),
  ('Brief', '#64748b', 1, false),
  ('Concept', '#8b5cf6', 2, false),
  ('Design', '#3b82f6', 3, false),
  ('Revisions', '#f97316', 4, false),
  ('Approval', '#eab308', 5, false),
  ('Delivered', '#22c55e', 6, false),
  ('Completed', '#10b981', 7, true);

-- RLS disabled for simplicity
ALTER TABLE task_board_columns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON task_board_columns FOR ALL TO authenticated USING (true) WITH CHECK (true);
