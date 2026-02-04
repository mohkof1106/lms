-- Add status column to task_subtasks table
-- Status: pending, in_progress, completed

ALTER TABLE task_subtasks
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'in_progress', 'completed'));

-- Update existing completed subtasks to have 'completed' status
UPDATE task_subtasks
SET status = 'completed'
WHERE completed = true;
