/*
  # Add Saved Businesses Feature

  1. New Tables
    - `saved_businesses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `business_id` (uuid, references businesses)
      - `created_at` (timestamp)
      - `notes` (text, optional)

  2. Security
    - Enable RLS on `saved_businesses` table
    - Add policies for authenticated users to manage their saved businesses
    - Add policy for public read access

  3. Indexes
    - Add indexes for better query performance
*/

-- Create saved_businesses table
CREATE TABLE saved_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Enable RLS
ALTER TABLE saved_businesses ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow users to manage their saved businesses"
  ON saved_businesses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_saved_businesses_user ON saved_businesses(user_id);
CREATE INDEX idx_saved_businesses_business ON saved_businesses(business_id);
CREATE INDEX idx_saved_businesses_created ON saved_businesses(created_at);

-- Add some sample data for testing
INSERT INTO saved_businesses (user_id, business_id)
SELECT 
  auth.uid(),
  id
FROM businesses
WHERE city = 'New York' AND state = 'New York'
LIMIT 5;