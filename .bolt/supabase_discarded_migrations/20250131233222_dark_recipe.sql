-- Create pro_onboarding table
CREATE TABLE pro_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  phone text NOT NULL,
  category text NOT NULL,
  description text,
  years_in_business integer,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  service_radius integer,
  alternate_phone text,
  service_categories text[] DEFAULT '{}',
  custom_services text,
  price_range text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pro_onboarding ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can insert their own onboarding data"
  ON pro_onboarding
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own onboarding data"
  ON pro_onboarding
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can update onboarding status"
  ON pro_onboarding
  FOR UPDATE
  TO authenticated
  USING (auth.is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (auth.is_admin(auth.jwt() ->> 'email'));

-- Create indexes
CREATE INDEX idx_pro_onboarding_user ON pro_onboarding(user_id);
CREATE INDEX idx_pro_onboarding_status ON pro_onboarding(status);
CREATE INDEX idx_pro_onboarding_created ON pro_onboarding(created_at);