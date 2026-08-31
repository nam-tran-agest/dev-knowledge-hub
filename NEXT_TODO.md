# 📋 DEV KNOWLEDGE HUB - HƯỚNG DẪN TIẾP TỤC (NEXT TO DO)

Tài liệu này tổng hợp toàn bộ các bước thiết lập API Keys, cấu hình biến môi trường (`.env`), cơ sở dữ liệu Supabase đã được đối chiếu chính xác 100% với TypeScript models và các tính năng mới nhất để bạn làm việc trên máy khác.

---

## 🔑 1. HƯỚNG DẪN LẤY VÀ CẤU HÌNH API KEYS

### A. Spotify Developer Keys (`SPOTIFY_CLIENT_ID` & `SPOTIFY_CLIENT_SECRET`)
1. Truy cập: [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) và đăng nhập tài khoản Spotify.
2. Bấm nút **"Create app"**:
   - **App name**: `Dev Knowledge Hub`
   - **App description**: `Personal Developer Dashboard`
   - **Redirect URIs** *(Bắt buộc chính xác)*:
     ```
     http://localhost:3000/api/auth/spotify/callback
     ```
   - Tích chọn **Web API** $\rightarrow$ Bấm **Save**.
3. Vào mục **Settings** của ứng dụng vừa tạo:
   - Copy **Client ID** $\rightarrow$ Dán vào `SPOTIFY_CLIENT_ID`.
   - Bấm **View client secret** $\rightarrow$ Copy **Client Secret** $\rightarrow$ Dán vào `SPOTIFY_CLIENT_SECRET`.

---

### B. Steam Web API Key (`STEAM_WEB_API_KEY`)
1. Truy cập: [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) và đăng nhập tài khoản Steam.
2. Tại ô **Domain Name**: Điền `localhost` (hoặc domain web thật nếu deploy).
3. Bấm **Register / Đăng ký**.
4. Copy chuỗi Key 32 ký tự $\rightarrow$ Dán vào `STEAM_WEB_API_KEY`.

---

## ⚙️ 2. MẪU FILE `.env.example`

Tạo file `.env` tại thư mục gốc của dự án trên máy mới:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here
SUPABASE_SECRET_KEY=your_supabase_secret_key_here

# Spotify Developer App
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Steam Web API
STEAM_WEB_API_KEY=your_steam_web_api_key_here
```

---

## 🗄️ 3. DATABASE SCHEMA SUPABASE (ĐÃ ĐỐI CHIẾU CHUẨN XÁC 100% VỚI CODE)

Chạy toàn bộ đoạn SQL dưới đây trong **SQL Editor** trên Supabase Dashboard:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. MODULE WORKING (PROJECTS, TASKS, TAGS)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#00f0ff',
    icon TEXT DEFAULT 'folder',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    "order" INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS "order" INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects User Isolation" ON public.projects;
CREATE POLICY "Projects User Isolation" ON public.projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done', 'in-progress')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    position INT DEFAULT 0,
    due_date TIMESTAMPTZ,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS position INT DEFAULT 0;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tasks User Isolation" ON public.tasks;
CREATE POLICY "Tasks User Isolation" ON public.tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#00f0ff',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tags ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tags User Isolation" ON public.tags;
CREATE POLICY "Tags User Isolation" ON public.tags FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.task_tags (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Task Tags Isolation" ON public.task_tags;
CREATE POLICY "Task Tags Isolation" ON public.task_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories User Isolation" ON public.categories;
CREATE POLICY "Categories User Isolation" ON public.categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 2. MODULE PLANNER (TIME-BLOCKING & SOMEDAY)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.planner_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
    date TEXT NOT NULL,
    time_block_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.planner_tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_planner_tasks_user_date ON public.planner_tasks(user_id, date);
ALTER TABLE public.planner_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Planner Tasks User Isolation" ON public.planner_tasks;
CREATE POLICY "Planner Tasks User Isolation" ON public.planner_tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 3. MODULE MEDIA (INTEGRATIONS: STEAM & SPOTIFY)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.steam_credentials (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    steam_id64 TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.steam_credentials ADD COLUMN IF NOT EXISTS steam_id64 TEXT;
ALTER TABLE public.steam_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Steam Credentials Isolation" ON public.steam_credentials;
CREATE POLICY "Steam Credentials Isolation" ON public.steam_credentials FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.spotify_credentials (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.spotify_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Spotify Credentials Isolation" ON public.spotify_credentials;
CREATE POLICY "Spotify Credentials Isolation" ON public.spotify_credentials FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 4. MODULE YOUTUBE (VIDEOS & PLAYLISTS)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    thumbnail_url TEXT,
    saved_time NUMERIC DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS saved_time NUMERIC DEFAULT 0;
ALTER TABLE public.youtube_videos ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_youtube_videos_user ON public.youtube_videos(user_id);
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "YouTube Videos Isolation" ON public.youtube_videos;
CREATE POLICY "YouTube Videos Isolation" ON public.youtube_videos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.youtube_playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_playlists ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.youtube_playlists ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
ALTER TABLE public.youtube_playlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "YouTube Playlists Isolation" ON public.youtube_playlists;
CREATE POLICY "YouTube Playlists Isolation" ON public.youtube_playlists FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.youtube_playlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID NOT NULL REFERENCES public.youtube_playlists(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.youtube_videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_playlist_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.youtube_playlist_items ADD COLUMN IF NOT EXISTS position INT DEFAULT 0;
ALTER TABLE public.youtube_playlist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "YouTube Playlist Items Isolation" ON public.youtube_playlist_items;
CREATE POLICY "YouTube Playlist Items Isolation" ON public.youtube_playlist_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. MODULE GAME-MOOD (DICTIONARY & CACHE)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.game_mood_dictionary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vibe TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    search_queries TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
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

-- ==========================================
-- 6. SEED DATA CHO GAME-MOOD
-- ==========================================

INSERT INTO public.game_mood_config (id, value) VALUES 
('fallback_queries', '["gaming mix", "epic gaming music", "background gaming", "gaming beats"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_mood_dictionary (vibe, tags, search_queries) VALUES
('Cyberpunk / Sci-Fi', ARRAY['Sci-fi', 'Cyberpunk', 'Space', 'Mechs', 'Futuristic', 'Post-apocalyptic'], ARRAY['synthwave', 'cyberpunk mix', 'dark synth', 'sci-fi soundtrack', 'darksynth']),
('Chill / Cozy', ARRAY['Cozy', 'Farming Sim', 'Life Sim', 'Relaxing', 'Casual', 'City Builder', 'Puzzle'], ARRAY['lofi gaming', 'cozy gaming', 'chill beats', 'stardew valley vibes', 'relaxing gaming', 'lofi chill']),
('Hardcore / Shooter', ARRAY['FPS', 'Shooter', 'Gore', 'Competitive', 'Action', 'Violent', 'Fast-Paced', 'Hero Shooter'], ARRAY['gaming edm', 'hype gaming', 'doom soundtrack', 'action gaming rock', 'bass boosted gaming']),
('Fantasy / RPG', ARRAY['RPG', 'Fantasy', 'Magic', 'Medieval', 'Open World', 'Adventure', 'Story Rich', 'Souls-like'], ARRAY['epic orchestral', 'fantasy tavern', 'rpg soundtrack', 'epic gaming', 'witcher vibes']),
('Horror / Dark', ARRAY['Horror', 'Psychological Horror', 'Survival Horror', 'Dark', 'Zombies', 'Lovecraftian'], ARRAY['creepy ambient', 'dark ambient', 'horror soundtrack', 'suspense music', 'spooky gaming']),
('Racing / Sports', ARRAY['Racing', 'Sports', 'Driving', 'Football', 'Automobile Sim'], ARRAY['racing beats', 'need for speed soundtrack', 'sports hype', 'driving phonk', 'eurobeat']),
('Strategy / Tactical', ARRAY['Strategy', 'Tactical', 'Turn-Based', 'Grand Strategy', 'RTS'], ARRAY['focus music', 'deep focus gaming', 'strategy soundtrack', 'cinematic ambient'])
ON CONFLICT DO NOTHING;
```

---

## 🚀 4. CÁC LỆNH KHỞI CHẠY & KIỂM TRA MÃ NGUỒN

Khi clone dự án về máy mới:

```bash
# 1. Cài đặt dependencies
yarn install

# 2. Chạy môi trường Development
yarn dev

# 3. Kiểm tra Typescript & Linting (Đảm bảo 0 errors, 0 warnings)
yarn check

# 4. Kiểm tra Production Build
yarn build
```

---

## 🎯 5. DANH SÁCH TÍNH NĂNG MỚI ĐÃ HOÀN THIỆN
1. **Planner Time-Blocking**:
   - Fix triệt để lỗi giật nhảy vị trí khi kéo thả.
   - Action Menu 3 chấm gán trực tiếp khung giờ từ 06:00 - 22:00.
   - Đầy đủ 3 chế độ xem: **Today** (`/planner/today`), **Week** (`/planner/week`), **Someday** (`/planner/someday`).
   - **Supabase WebSockets Realtime**: Tự động đồng bộ lịch trình đa thiết bị tức thì.
2. **Gaming Hub & OBS Live Widget**:
   - Tích hợp Steam OpenID và Steam Web API.
   - Tích hợp Spotify OAuth và thuật toán chuyển nhạc theo Game Mood.
   - Live Session Timer đếm thời gian chơi game thực tế trên Widget OBS (`/live-widget`).

---

## ☁️ 6. HƯỚNG DẪN CẤU HÌNH CLOUDFLARE WORKERS / PAGES

Khi deploy ứng dụng lên **Cloudflare Pages / Workers**, không cần upload file `.env`. Bạn gắn các biến môi trường trực tiếp trên Cloudflare Dashboard:

### A. Các bước thiết lập trên Cloudflare
1. Truy cập [dash.cloudflare.com](https://dash.cloudflare.com/) $\rightarrow$ Chọn **Workers & Pages** $\rightarrow$ Chọn **Project của bạn**.
2. Chuyển sang tab **Settings** $\rightarrow$ Chọn **Variables and Secrets**.
3. Bấm **Add variable** và thêm lần lượt các biến sau:

| Tên Biến (Variable Name) | Giá Trị (Value) | Loại (Type) | Ghi Chú |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | **Plain text** | Cần cho cả Production & Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | **Plain text** | Cần cho cả Production & Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | 🔒 **Encrypt** | Secret quản trị Supabase |
| `SPOTIFY_CLIENT_ID` | Client ID từ Spotify | **Plain text** | Định danh Spotify App |
| `SPOTIFY_CLIENT_SECRET` | Client Secret từ Spotify | 🔒 **Encrypt** | Secret bí mật Spotify |
| `SPOTIFY_REDIRECT_URI` | `https://your-domain.pages.dev/api/auth/spotify/callback` | **Plain text** | URL Callback trên Cloudflare |
| `STEAM_WEB_API_KEY` | Key 32 ký tự từ Steam | 🔒 **Encrypt** | Key gọi Steam API |

*(Bấm nút **Encrypt** cho các trường Secret để Cloudflare mã hóa bảo mật).*

### B. Lưu ý về Redirect URI trên Spotify Dashboard
Khi chạy production trên Cloudflare, hãy vào lại [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) $\rightarrow$ Vào **Settings** ứng dụng $\rightarrow$ Thêm domain Cloudflare vào mục **Redirect URIs**:
```
https://tên-dự-án-của-bạn.pages.dev/api/auth/spotify/callback
```
*(Spotify hỗ trợ nhiều link song song, bạn có thể giữ cả `http://localhost:3000/...` và link Cloudflare).*

