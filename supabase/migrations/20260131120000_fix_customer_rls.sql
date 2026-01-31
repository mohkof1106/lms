-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Allow read customers" ON customers;
DROP POLICY IF EXISTS "Allow insert customers" ON customers;
DROP POLICY IF EXISTS "Allow update customers" ON customers;
DROP POLICY IF EXISTS "Allow delete customers" ON customers;

DROP POLICY IF EXISTS "Allow read customer_contacts" ON customer_contacts;
DROP POLICY IF EXISTS "Allow insert customer_contacts" ON customer_contacts;
DROP POLICY IF EXISTS "Allow update customer_contacts" ON customer_contacts;
DROP POLICY IF EXISTS "Allow delete customer_contacts" ON customer_contacts;

-- Disable RLS entirely for internal dashboard
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contacts DISABLE ROW LEVEL SECURITY;
