-- Fix: recursive RLS policies on user_profiles cause 500 error
-- The admin check subquery references user_profiles itself = infinite recursion

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Insert own or admin insert" ON user_profiles;
DROP POLICY IF EXISTS "Update own or admin update" ON user_profiles;
DROP POLICY IF EXISTS "Admin delete profiles" ON user_profiles;

-- Helper function to check admin role without triggering RLS recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND system_role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- New non-recursive policies

-- All authenticated users can read all profiles (internal app, needed for notifications/pings)
CREATE POLICY "Authenticated can read profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Insert: own profile (via trigger) or admin
CREATE POLICY "Insert own or admin"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid() OR is_admin());

-- Update: own profile or admin
CREATE POLICY "Update own or admin"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

-- Delete: admin only
CREATE POLICY "Admin delete"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (is_admin());
