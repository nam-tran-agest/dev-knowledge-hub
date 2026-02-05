-- 1. Create Categories Table (The Manager)
CREATE TABLE IF NOT EXISTS kb_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    color text NOT NULL DEFAULT '#6366f1',
    icon text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Categories
INSERT INTO kb_categories (slug, name, color) VALUES
    ('work', 'Work', '#3b82f6'),
    ('learn', 'Learn', '#10b981'),
    ('ideas', 'Ideas', '#f59e0b'),
    ('life', 'Life', '#ec4899')
ON CONFLICT (slug) DO NOTHING;

-- 2. Create Separate Note Tables
-- Helper macro or just repeated code for clarity

CREATE TABLE IF NOT EXISTS kb_notes_work (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text,
    category_slug text DEFAULT 'work' REFERENCES kb_categories(slug) ON UPDATE CASCADE, -- Added Link
    user_id uuid DEFAULT auth.uid(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    is_published boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS kb_notes_learn (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text,
    category_slug text DEFAULT 'learn' REFERENCES kb_categories(slug) ON UPDATE CASCADE, -- Added Link
    user_id uuid DEFAULT auth.uid(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    is_published boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS kb_notes_ideas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text,
    category_slug text DEFAULT 'ideas' REFERENCES kb_categories(slug) ON UPDATE CASCADE, -- Added Link
    user_id uuid DEFAULT auth.uid(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    is_published boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS kb_notes_life (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text,
    category_slug text DEFAULT 'life' REFERENCES kb_categories(slug) ON UPDATE CASCADE, -- Added Link
    user_id uuid DEFAULT auth.uid(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    is_published boolean DEFAULT false
);

-- 3. Unified View (Now with JOIN to provide full details)
CREATE OR REPLACE VIEW kb_notes_unified AS
    SELECT 
        n.*, 
        c.name as category_name, 
        c.color as category_color, 
        c.icon as category_icon
    FROM (
        SELECT *, 'work'::text as source_table FROM kb_notes_work
        UNION ALL
        SELECT *, 'learn'::text as source_table FROM kb_notes_learn
        UNION ALL
        SELECT *, 'ideas'::text as source_table FROM kb_notes_ideas
        UNION ALL
        SELECT *, 'life'::text as source_table FROM kb_notes_life
    ) n
    LEFT JOIN kb_categories c ON n.category_slug = c.slug;

-- 4. Enable RLS
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_notes_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_notes_learn ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_notes_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_notes_life ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Categories: Public read
DROP POLICY IF EXISTS "Categories viewable by everyone" ON kb_categories;
CREATE POLICY "Categories viewable by everyone" ON kb_categories FOR SELECT USING (true);

-- Notes: Owner manage, Public read published
-- WORK
DROP POLICY IF EXISTS "Manage own work" ON kb_notes_work;
CREATE POLICY "Manage own work" ON kb_notes_work FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Read published work" ON kb_notes_work;
CREATE POLICY "Read published work" ON kb_notes_work FOR SELECT USING (is_published = true);

-- LEARN
DROP POLICY IF EXISTS "Manage own learn" ON kb_notes_learn;
CREATE POLICY "Manage own learn" ON kb_notes_learn FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Read published learn" ON kb_notes_learn;
CREATE POLICY "Read published learn" ON kb_notes_learn FOR SELECT USING (is_published = true);

-- IDEAS
DROP POLICY IF EXISTS "Manage own ideas" ON kb_notes_ideas;
CREATE POLICY "Manage own ideas" ON kb_notes_ideas FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Read published ideas" ON kb_notes_ideas;
CREATE POLICY "Read published ideas" ON kb_notes_ideas FOR SELECT USING (is_published = true);

-- 6. Tags Table
CREATE TABLE IF NOT EXISTS kb_tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid DEFAULT auth.uid()
);

-- RLS for Tags
ALTER TABLE kb_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tags viewable by everyone" ON kb_tags;
CREATE POLICY "Tags viewable by everyone" ON kb_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create tags" ON kb_tags;
CREATE POLICY "Authenticated users can create tags" ON kb_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

