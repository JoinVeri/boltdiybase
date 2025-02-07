-- Add any missing indexes (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_categories' 
    AND indexname = 'idx_business_categories_business'
  ) THEN
    CREATE INDEX idx_business_categories_business ON business_categories(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_categories' 
    AND indexname = 'idx_business_categories_category'
  ) THEN
    CREATE INDEX idx_business_categories_category ON business_categories(category_id);
  END IF;
END $$;

-- Add any missing policies (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_categories' 
    AND policyname = 'Allow public read access to business_categories'
  ) THEN
    CREATE POLICY "Allow public read access to business_categories"
      ON business_categories
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_categories' 
    AND policyname = 'Allow authenticated users to manage their business categories'
  ) THEN
    CREATE POLICY "Allow authenticated users to manage their business categories"
      ON business_categories
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM businesses 
          WHERE businesses.id = business_categories.business_id 
          AND businesses.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM businesses 
          WHERE businesses.id = business_categories.business_id 
          AND businesses.user_id = auth.uid()
        )
      );
  END IF;
END $$;