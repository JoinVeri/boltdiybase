-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to admin_users"
  ON admin_users
  FOR SELECT
  TO public
  USING (true);

-- Insert admin user
INSERT INTO admin_users (email)
VALUES ('hello@verilocal.pro')
ON CONFLICT (email) DO NOTHING;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin(email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = is_admin.email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION auth.current_user_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT auth.is_admin(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;