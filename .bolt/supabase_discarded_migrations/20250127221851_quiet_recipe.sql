/*
  # Add social media links to businesses

  1. Changes
    - Add social media URL columns to businesses table:
      - youtube_url
      - facebook_url
      - instagram_url
      - pinterest_url
      - google_url
*/

DO $$ 
BEGIN
  -- Add social media columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'youtube_url') THEN
    ALTER TABLE businesses ADD COLUMN youtube_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'facebook_url') THEN
    ALTER TABLE businesses ADD COLUMN facebook_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'instagram_url') THEN
    ALTER TABLE businesses ADD COLUMN instagram_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'pinterest_url') THEN
    ALTER TABLE businesses ADD COLUMN pinterest_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'google_url') THEN
    ALTER TABLE businesses ADD COLUMN google_url text;
  END IF;
END $$;