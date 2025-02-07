-- Drop existing table if it exists
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_name text NOT NULL,
  message text NOT NULL,
  services text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can view/manage submissions
CREATE POLICY "Only admins can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "Only admins can update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (auth.is_admin(auth.jwt() ->> 'email'));

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submission_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submission_timestamp
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submission_timestamp();

-- Grant necessary permissions
GRANT ALL ON contact_submissions TO authenticated;
GRANT ALL ON contact_submissions TO service_role;