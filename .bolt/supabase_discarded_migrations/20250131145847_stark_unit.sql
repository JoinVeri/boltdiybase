-- Add phone column to businesses table if it doesn't exist
DO $$ 
BEGIN
  -- First check if column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'businesses' 
    AND column_name = 'phone'
  ) THEN
    -- Add phone column
    ALTER TABLE businesses 
    ADD COLUMN phone text;

    -- Add index for phone number searches
    CREATE INDEX idx_businesses_phone ON businesses(phone);

    -- Add validation constraint for phone numbers
    ALTER TABLE businesses
    ADD CONSTRAINT valid_phone_number
    CHECK (
      phone IS NULL OR 
      phone ~ '^\+?[0-9\-\(\)\s\.]+$'
    );
  END IF;
END $$;