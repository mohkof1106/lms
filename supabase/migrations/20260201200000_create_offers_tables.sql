-- Create offer status enum
CREATE TYPE offer_status AS ENUM (
  'draft',
  'sent',
  'accepted',
  'rejected',
  'expired'
);

-- Create offers table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Auto-generated offer number (LOR-YYYY-NNN)
  offer_number TEXT UNIQUE NOT NULL,

  -- Customer relationship
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,

  -- Basic info
  title TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL,

  -- Pricing
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 5,
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Content
  terms TEXT,
  notes TEXT,

  -- Status
  status offer_status NOT NULL DEFAULT 'draft',

  -- Internal cost tracking (from estimator)
  labor_cost NUMERIC(12,2) DEFAULT 0,
  overhead_percent NUMERIC(5,2) DEFAULT 0,
  overhead_amount NUMERIC(12,2) DEFAULT 0,
  profit_amount NUMERIC(12,2) DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create offer_line_items table
CREATE TABLE offer_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,

  -- Optional service reference
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  -- Line item details
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- For outsourced items
  is_pass_through BOOLEAN DEFAULT false,

  -- Ordering
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_offers_customer_id ON offers(customer_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_date ON offers(date);
CREATE INDEX idx_offer_line_items_offer_id ON offer_line_items(offer_id);

-- Function to generate next offer number (LOR-YYYY-NNN)
CREATE OR REPLACE FUNCTION generate_offer_number()
RETURNS TEXT AS $$
DECLARE
  current_year INTEGER;
  next_seq INTEGER;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(offer_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM offers
  WHERE offer_number LIKE 'LOR-' || current_year || '-%';

  RETURN 'LOR-' || current_year || '-' || LPAD(next_seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate offer_number on insert
CREATE OR REPLACE FUNCTION set_offer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.offer_number IS NULL OR NEW.offer_number = '' THEN
    NEW.offer_number := generate_offer_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_offer_number
  BEFORE INSERT ON offers
  FOR EACH ROW
  EXECUTE FUNCTION set_offer_number();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_offers_updated_at();

-- Disable RLS for now
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE offer_line_items DISABLE ROW LEVEL SECURITY;
