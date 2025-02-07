-- Add tiktok_url column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS tiktok_url text;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_tiktok ON businesses(tiktok_url);