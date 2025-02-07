/*
  # Update Business Categories

  1. Changes
    - Add missing indexes if needed
    - Add any missing policies
    - Add data validation constraints
  
  2. Safety
    - Check for existing objects before creating
    - Use IF NOT EXISTS clauses
*/

-- Add any missing indexes (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_categories' 
    AND indexname = 'idx_business_categories_created'
  ) THEN
    CREATE INDEX idx_business_categories_created ON business_categories(created_at);
  END IF;
END $$;

-- Add data validation check constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'business_categories_valid_dates'
  ) THEN
    ALTER TABLE business_categories
    ADD CONSTRAINT business_categories_valid_dates
    CHECK (created_at <= CURRENT_TIMESTAMP);
  END IF;
END $$;

-- Add additional policy for soft deletes if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_categories' 
    AND policyname = 'Allow users to soft delete their business categories'
  ) THEN
    CREATE POLICY "Allow users to soft delete their business categories"
      ON business_categories
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM businesses 
          WHERE businesses.id = business_categories.business_id 
          AND businesses.user_id = auth.uid()
        )
      );
  END IF;
END $$;