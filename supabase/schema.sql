-- ==============================================================================
-- DEV KNOWLEDGE HUB - FULL DATABASE SCHEMA & FAIL-SAFE MIGRATION (PRODUCTION)
-- Tested and 100% aligned with Next.js 16 + OpenNext on Cloudflare Workers
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. MODULE WORKING (PROJECTS, TASKS, CATEGORIES)
-- ==============================================================================

-- 1.1 Bảng projects (Dự án Agile / Kanban Workspace)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT,
    key TEXT,
    color TEXT DEFAULT '#00f0ff',
    icon TEXT DEFAULT 'Layout',
    status TEXT DEFAULT 'active',
    "order" INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fail-safe: Tự động bổ sung cột nếu bảng đã tồn tại từ trước
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#00f0ff';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Layout';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS "order" INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Chuyển đổi dữ liệu title -> name nếu bảng cũ từng dùng title
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'title') THEN
        UPDATE public.projects SET name = title WHERE name IS NULL AND title IS NOT NULL;
        ALTER TABLE public.projects ALTER COLUMN title DROP NOT NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_slug ON public.projects(user_id, slug);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects User Isolation" ON public.projects;
CREATE POLICY "Projects User Isolation" ON public.projects 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- 1.2 Bảng tasks (Thẻ công việc Kanban 5 cột Agile)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    position INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    issue_type TEXT DEFAULT 'task',
    story_points INT,
    subtasks JSONB DEFAULT '[]'::jsonb,
    issue_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fail-safe: Tự động bổ sung đầy đủ các cột Agile cho tasks
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS position INT DEFAULT 0;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS issue_type TEXT DEFAULT 'task';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS story_points INT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS issue_key TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_position ON public.tasks(project_id, position);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tasks User Isolation" ON public.tasks;
CREATE POLICY "Tasks User Isolation" ON public.tasks 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- 1.3 Bảng categories (Phân loại chung)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories User Isolation" ON public.categories;
CREATE POLICY "Categories User Isolation" ON public.categories 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- 2. MODULE PLANNER (PLANNER_TASKS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.planner_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo',
    date TEXT NOT NULL,
    time_block_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.planner_tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_planner_tasks_user_date ON public.planner_tasks(user_id, date);

ALTER TABLE public.planner_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Planner Tasks User Isolation" ON public.planner_tasks;
CREATE POLICY "Planner Tasks User Isolation" ON public.planner_tasks 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- 3. MODULE INTEGRATIONS (STEAM & SPOTIFY CREDENTIALS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.steam_credentials (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    steam_id64 TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.steam_credentials ADD COLUMN IF NOT EXISTS steam_id64 TEXT;
ALTER TABLE public.steam_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Steam Credentials Isolation" ON public.steam_credentials;
CREATE POLICY "Steam Credentials Isolation" ON public.steam_credentials 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.spotify_credentials (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.spotify_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Spotify Credentials Isolation" ON public.spotify_credentials;
CREATE POLICY "Spotify Credentials Isolation" ON public.spotify_credentials 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- 4. MODULE YOUTUBE (VIDEOS & PLAYLISTS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    video_id TEXT,
    title TEXT NOT NULL,
    channel_title TEXT,
    thumbnail_url TEXT,
    duration TEXT,
    saved_time INT DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false,
    last_played_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS saved_time INT DEFAULT 0;
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Chuyển dữ liệu favorite sang is_favorite nếu bảng cũ từng dùng favorite
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtube_videos' AND column_name = 'favorite') THEN
        UPDATE public.youtube_videos SET is_favorite = favorite WHERE is_favorite IS NULL AND favorite IS NOT NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_youtube_videos_user ON public.youtube_videos(user_id);
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "YouTube Videos Isolation" ON public.youtube_videos;
CREATE POLICY "YouTube Videos Isolation" ON public.youtube_videos 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.youtube_playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_playlists ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.youtube_playlists ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.youtube_playlists ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

ALTER TABLE public.youtube_playlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "YouTube Playlists Isolation" ON public.youtube_playlists;
CREATE POLICY "YouTube Playlists Isolation" ON public.youtube_playlists 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.youtube_playlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID NOT NULL REFERENCES public.youtube_playlists(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.youtube_videos(id) ON DELETE CASCADE,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_playlist_items ADD COLUMN IF NOT EXISTS position INT DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_youtube_playlist_items_playlist ON public.youtube_playlist_items(playlist_id);

-- Đảm bảo có unique constraint chống trùng lặp video trong playlist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_playlist_video') THEN
        ALTER TABLE public.youtube_playlist_items ADD CONSTRAINT uq_playlist_video UNIQUE (playlist_id, video_id);
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

ALTER TABLE public.youtube_playlist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "YouTube Playlist Items Isolation" ON public.youtube_playlist_items;
-- RLS Policy: Xác thực quyền sở hữu gián tiếp thông qua playlist của user
CREATE POLICY "YouTube Playlist Items Isolation" ON public.youtube_playlist_items 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.youtube_playlists p 
            WHERE p.id = youtube_playlist_items.playlist_id AND p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.youtube_playlists p 
            WHERE p.id = youtube_playlist_items.playlist_id AND p.user_id = auth.uid()
        )
    );


-- ==============================================================================
-- 5. MODULE GAME-MOOD (DICTIONARY & CACHE)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.game_mood_dictionary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vibe TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    search_queries TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tự động thêm Unique constraint an toàn cho vibe
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_game_mood_vibe') THEN
        ALTER TABLE public.game_mood_dictionary ADD CONSTRAINT uq_game_mood_vibe UNIQUE (vibe);
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

ALTER TABLE public.game_mood_dictionary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Game Mood Dictionary" ON public.game_mood_dictionary;
CREATE POLICY "Public Read Game Mood Dictionary" ON public.game_mood_dictionary FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.game_mood_config (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL
);
ALTER TABLE public.game_mood_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Game Mood Config" ON public.game_mood_config;
CREATE POLICY "Public Read Game Mood Config" ON public.game_mood_config FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.game_playlist_cache (
    app_id TEXT PRIMARY KEY,
    playlist_uri TEXT NOT NULL,
    matched_tags TEXT[] NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.game_playlist_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Game Cache" ON public.game_playlist_cache;
CREATE POLICY "Public Read Game Cache" ON public.game_playlist_cache FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth Write Game Cache" ON public.game_playlist_cache;
CREATE POLICY "Auth Write Game Cache" ON public.game_playlist_cache FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Update Game Cache" ON public.game_playlist_cache;
CREATE POLICY "Auth Update Game Cache" ON public.game_playlist_cache FOR UPDATE USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 6. REALTIME REPLICATION (TỰ ĐỘNG ĐỒNG BỘ THỜI GIAN THỰC)
-- ==============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'planner_tasks') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.planner_tasks;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tasks') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'projects') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;


-- ==============================================================================
-- 7. SEED DỮ LIỆU GAME MOOD & VIBES (DÙNG WHERE NOT EXISTS - TRÁNH LỖI 42P10)
-- ==============================================================================

INSERT INTO public.game_mood_config (id, value)
SELECT 'fallback_queries', '["gaming mix", "epic gaming music", "background gaming", "gaming beats"]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM public.game_mood_config WHERE id = 'fallback_queries'
);

INSERT INTO public.game_mood_dictionary (vibe, tags, search_queries)
SELECT v.vibe, v.tags, v.search_queries
FROM (VALUES
    ('Cyberpunk / Sci-Fi', ARRAY['Sci-fi', 'Cyberpunk', 'Space', 'Mechs', 'Futuristic', 'Post-apocalyptic'], ARRAY['synthwave', 'cyberpunk mix', 'dark synth', 'sci-fi soundtrack', 'darksynth']),
    ('Chill / Cozy', ARRAY['Cozy', 'Farming Sim', 'Life Sim', 'Relaxing', 'Casual', 'City Builder', 'Puzzle'], ARRAY['lofi gaming', 'cozy gaming', 'chill beats', 'stardew valley vibes', 'relaxing gaming', 'lofi chill']),
    ('Hardcore / Shooter', ARRAY['FPS', 'Shooter', 'Gore', 'Competitive', 'Action', 'Violent', 'Fast-Paced', 'Hero Shooter'], ARRAY['gaming edm', 'hype gaming', 'doom soundtrack', 'action gaming rock', 'bass boosted gaming']),
    ('Fantasy / RPG', ARRAY['RPG', 'Fantasy', 'Magic', 'Medieval', 'Open World', 'Adventure', 'Story Rich', 'Souls-like'], ARRAY['epic orchestral', 'fantasy tavern', 'rpg soundtrack', 'epic gaming', 'witcher vibes']),
    ('Horror / Dark', ARRAY['Horror', 'Psychological Horror', 'Survival Horror', 'Dark', 'Zombies', 'Lovecraftian'], ARRAY['creepy ambient', 'dark ambient', 'horror soundtrack', 'suspense music', 'spooky gaming']),
    ('Racing / Sports', ARRAY['Racing', 'Sports', 'Driving', 'Football', 'Automobile Sim'], ARRAY['racing beats', 'need for speed soundtrack', 'sports hype', 'driving phonk', 'eurobeat']),
    ('Strategy / Tactical', ARRAY['Strategy', 'Tactical', 'Turn-Based', 'Grand Strategy', 'RTS'], ARRAY['focus music', 'deep focus gaming', 'strategy soundtrack', 'cinematic ambient'])
) AS v(vibe, tags, search_queries)
WHERE NOT EXISTS (
    SELECT 1 FROM public.game_mood_dictionary d WHERE d.vibe = v.vibe
);
