-- Add 'description' and 'source' columns to 'places' table if they don't exist

ALTER TABLE places 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS source text DEFAULT 'system';

-- Optional: Create an index on source for faster filtering
CREATE INDEX IF NOT EXISTS places_source_idx ON places (source);
