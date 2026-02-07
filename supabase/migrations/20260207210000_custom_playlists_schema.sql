-- Drop previous table if exists to start fresh with new custom schema
DROP TABLE IF EXISTS youtube_playlist_items CASCADE;
DROP TABLE IF EXISTS youtube_playlist_videos CASCADE;
DROP TABLE IF EXISTS youtube_playlists CASCADE;

-- Create youtube_playlists table (Custom Internal Collections)
CREATE TABLE youtube_playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT, -- Can be derived from the first video
  is_favorite BOOLEAN DEFAULT false,
  user_id UUID DEFAULT auth.uid()
);

-- Create youtube_playlist_items (Join table for Videos and Playlists)
CREATE TABLE youtube_playlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  playlist_id UUID REFERENCES youtube_playlists(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES youtube_videos(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0, -- To support manual sorting later
  UNIQUE(playlist_id, video_id)
);

-- Create indices
CREATE INDEX idx_youtube_playlists_user_id ON youtube_playlists(user_id);
CREATE INDEX idx_youtube_playlist_items_playlist_id ON youtube_playlist_items(playlist_id);
CREATE INDEX idx_youtube_playlist_items_video_id ON youtube_playlist_items(video_id);

-- Set up RLS (matching existing setup)
ALTER TABLE youtube_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_playlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for playlists" ON youtube_playlists FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for playlists" ON youtube_playlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access for playlists" ON youtube_playlists FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access for playlists" ON youtube_playlists FOR DELETE USING (true);

CREATE POLICY "Allow public read access for playlist_items" ON youtube_playlist_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for playlist_items" ON youtube_playlist_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access for playlist_items" ON youtube_playlist_items FOR DELETE USING (true);
