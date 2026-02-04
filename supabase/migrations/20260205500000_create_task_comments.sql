-- Task comments table
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);

-- Update timestamp trigger
CREATE TRIGGER trigger_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();

-- RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON task_comments FOR ALL TO authenticated USING (true) WITH CHECK (true);
