-- Add LPO number and tasks_initiated flag to offers table
ALTER TABLE offers ADD COLUMN lpo_number TEXT;
ALTER TABLE offers ADD COLUMN tasks_initiated BOOLEAN DEFAULT false;

-- Index for LPO lookup
CREATE INDEX idx_offers_lpo_number ON offers(lpo_number);
