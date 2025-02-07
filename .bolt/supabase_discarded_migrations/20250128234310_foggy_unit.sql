-- Add profile fields to admin_users table
ALTER TABLE admin_users
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN avatar_url text;

-- Update existing admin user with sample data
UPDATE admin_users
SET 
  first_name = 'Admin',
  last_name = 'User'
WHERE email = 'hello@verilocal.pro';