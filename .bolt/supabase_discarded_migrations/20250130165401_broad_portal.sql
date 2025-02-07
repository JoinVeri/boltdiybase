-- First ensure we have the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "http";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage.storage_public_url function
CREATE OR REPLACE FUNCTION storage.storage_public_url(bucket text, name text)
RETURNS text AS $$
  SELECT 'https://hiiqznjqvlirpptknglm.supabase.co/storage/v1/object/public/' || bucket || '/' || name;
$$ LANGUAGE sql IMMUTABLE;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow users to upload business media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete business media" ON storage.objects;
DROP POLICY IF EXISTS "Give public read-only access" ON storage.objects;

-- Create public read access policy
CREATE POLICY "Give public read-only access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

-- Create policy for business media uploads
CREATE POLICY "Allow users to upload business media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media'
);

-- Create policy for business media deletions
CREATE POLICY "Allow users to delete business media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media'
);

-- Ensure proper permissions
GRANT USAGE ON SCHEMA storage TO postgres, authenticated, anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO postgres, authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA storage TO anon;