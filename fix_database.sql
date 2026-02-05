-- 1. Add columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtube_videos' AND column_name = 'is_favorite') THEN
        ALTER TABLE youtube_videos ADD COLUMN is_favorite boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtube_videos' AND column_name = 'updated_at') THEN
        ALTER TABLE youtube_videos ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
        CREATE INDEX idx_youtube_videos_updated_at ON youtube_videos(updated_at DESC);
    END IF;
END $$;

-- 2. Create/Update RPC function
CREATE OR REPLACE FUNCTION get_videos_paginated_by_days(days_limit int, days_offset int)
RETURNS SETOF youtube_videos
LANGUAGE plpgsql
SECURITY DEFINER -- Run with owner privileges to bypass RLS issues inside the function if needed, or stick to INVOKER
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

-- 3. Enabling RLS and Policies (Safety Net)
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see/edit their own videos
DROP POLICY IF EXISTS "Users can see own videos" ON youtube_videos;
CREATE POLICY "Users can see own videos" ON youtube_videos
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own videos" ON youtube_videos;
CREATE POLICY "Users can insert own videos" ON youtube_videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own videos" ON youtube_videos;
CREATE POLICY "Users can update own videos" ON youtube_videos
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own videos" ON youtube_videos;
CREATE POLICY "Users can delete own videos" ON youtube_videos
    FOR DELETE USING (auth.uid() = user_id);
