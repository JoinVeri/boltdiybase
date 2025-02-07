-- Create saved_deals table
CREATE TABLE saved_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES business_deals(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, deal_id)
);

-- Enable RLS
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow users to manage their saved deals"
  ON saved_deals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_saved_deals_user ON saved_deals(user_id);
CREATE INDEX idx_saved_deals_deal ON saved_deals(deal_id);
CREATE INDEX idx_saved_deals_business ON saved_deals(business_id);
CREATE INDEX idx_saved_deals_created ON saved_deals(created_at);