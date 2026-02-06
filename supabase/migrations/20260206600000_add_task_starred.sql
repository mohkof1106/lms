-- Add is_starred column to tasks for marking portfolio examples
ALTER TABLE tasks ADD COLUMN is_starred BOOLEAN DEFAULT false NOT NULL;

-- Partial index for efficient filtering (only starred rows indexed)
CREATE INDEX idx_tasks_is_starred ON tasks(is_starred) WHERE is_starred = true;
