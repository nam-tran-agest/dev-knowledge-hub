-- Add new columns
ALTER TABLE youtube_videos 
ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_youtube_videos_updated_at ON youtube_videos(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_user_id ON youtube_videos(user_id);

-- Create RPC function for "Smart History" pagination
-- Fetches all videos that fall within the top N active days (days that have data)
CREATE OR REPLACE FUNCTION get_videos_paginated_by_days(days_limit int, days_offset int)
RETURNS SETOF youtube_videos
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH target_dates AS (
    SELECT DISTINCT date_trunc('day', updated_at) as day
    FROM youtube_videos
    ORDER BY day DESC
    LIMIT days_limit OFFSET days_offset
  )
  SELECT v.*
  FROM youtube_videos v
  INNER JOIN target_dates td ON date_trunc('day', v.updated_at) = td.day
  ORDER BY v.updated_at DESC;
END;
$$;
