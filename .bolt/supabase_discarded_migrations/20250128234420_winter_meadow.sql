-- First ensure we have the required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin user in auth.users if it doesn't exist
DO $$
DECLARE
  admin_uid uuid;
  hashed_password text;
BEGIN
  -- Generate hashed password using pgcrypto
  SELECT encode(digest('verilocal123', 'sha256'), 'hex') INTO hashed_password;

  -- First check if the user already exists
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = 'hello@verilocal.pro';

  -- If user doesn't exist, create them
  IF admin_uid IS NULL THEN
    INSERT INTO auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hello@verilocal.pro',
      crypt('verilocal123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"user_type": "admin"}',
      now(),
      now()
    )
    RETURNING id INTO admin_uid;

    -- Insert identity
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      admin_uid,
      jsonb_build_object('sub', admin_uid),
      'email',
      now(),
      now()
    );
  END IF;

  -- Update admin_users table
  INSERT INTO admin_users (id, email, first_name, last_name)
  VALUES (
    admin_uid,
    'hello@verilocal.pro',
    'Admin',
    'User'
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    id = EXCLUDED.id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

END $$;

-- Ensure proper permissions
ALTER TABLE auth.users OWNER TO supabase_auth_admin;
ALTER TABLE auth.identities OWNER TO supabase_auth_admin;
GRANT ALL ON auth.users TO supabase_auth_admin;
GRANT ALL ON auth.identities TO supabase_auth_admin;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;

-- Add RLS policies for admin_users
DROP POLICY IF EXISTS "Allow admins to update their own profile" ON admin_users;
CREATE POLICY "Allow admins to update their own profile"
ON admin_users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);