-- Create article_categories table
CREATE TABLE article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to article_categories"
  ON article_categories
  FOR SELECT
  TO public
  USING (true);

-- Insert default categories
INSERT INTO article_categories (name, description) VALUES
  ('Business Tips', 'Helpful tips and advice for running a business'),
  ('Industry News', 'Latest updates and news from various industries'),
  ('How-to Guides', 'Step-by-step guides and tutorials'),
  ('Success Stories', 'Stories of business achievements and milestones'),
  ('Expert Advice', 'Professional insights and recommendations'),
  ('Local Insights', 'Information about local business community')
ON CONFLICT (name) DO NOTHING;

-- Add index for better performance
CREATE INDEX idx_article_categories_name ON article_categories(name);