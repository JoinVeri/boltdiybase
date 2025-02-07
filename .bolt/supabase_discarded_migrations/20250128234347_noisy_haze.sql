-- Create admin user in auth.users if it doesn't exist
DO $$
DECLARE
  admin_uid uuid;
BEGIN
  -- First check if the user already exists
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = 'hello@verilocal.pro';

  -- If user doesn't exist, create them
  IF admin_uid IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hello@verilocal.pro',
      crypt('verilocal123', gen_salt('bf')), -- Default password: verilocal123
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"user_type":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_uid;
  END IF;

  -- Ensure admin user exists in admin_users table
  INSERT INTO admin_users (id, email, first_name, last_name)
  VALUES (
    admin_uid,
    'hello@verilocal.pro',
    'Admin',
    'User'
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    id = admin_uid,
    first_name = 'Admin',
    last_name = 'User';
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON auth.identities TO postgres;