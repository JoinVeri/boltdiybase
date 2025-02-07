-- Create saved_articles table
CREATE TABLE saved_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES business_articles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow users to manage their saved articles"
  ON saved_articles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_saved_articles_user ON saved_articles(user_id);
CREATE INDEX idx_saved_articles_article ON saved_articles(article_id);
CREATE INDEX idx_saved_articles_business ON saved_articles(business_id);
CREATE INDEX idx_saved_articles_created ON saved_articles(created_at);