-- Create expense category enum
CREATE TYPE expense_category AS ENUM (
  'rent',
  'utilities',
  'software',
  'equipment',
  'marketing',
  'office_supplies',
  'professional_services',
  'travel',
  'team_activities',
  'taxes_fees',
  'insurance',
  'maintenance',
  'other'
);

-- Create expense status enum
CREATE TYPE expense_status AS ENUM (
  'pending',
  'paid',
  'voided'
);

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category expense_category NOT NULL,
  status expense_status NOT NULL DEFAULT 'pending',

  -- Date fields
  expense_date DATE NOT NULL,
  payment_date DATE,
  due_date DATE,

  -- Payment details
  payment_method TEXT,
  payment_reference TEXT,

  -- Vendor info
  vendor_name TEXT,

  -- Asset link
  is_asset_purchase BOOLEAN NOT NULL DEFAULT false,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_asset_id ON expenses(asset_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_expenses_updated_at();

-- Disable RLS for now (can enable later with policies)
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
