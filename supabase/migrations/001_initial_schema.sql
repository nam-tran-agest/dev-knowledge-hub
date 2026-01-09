-- Dev Knowledge Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- ============================================
-- TAGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- ============================================
-- NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SNIPPETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'javascript',
    type VARCHAR(20) CHECK (type IN ('code', 'prompt')) DEFAULT 'code',
    description TEXT,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo',
    deadline TIMESTAMPTZ,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bugs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    root_cause TEXT,
    solution TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JUNCTION TABLES FOR TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS note_tags (
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

CREATE TABLE IF NOT EXISTS snippet_tags (
    snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (snippet_id, tag_id)
);

CREATE TABLE IF NOT EXISTS bug_tags (
    bug_id UUID REFERENCES bugs(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (bug_id, tag_id)
);

-- ============================================
-- TASK LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS task_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
    CHECK (
        (note_id IS NOT NULL AND snippet_id IS NULL) OR
        (note_id IS NULL AND snippet_id IS NOT NULL)
    )
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category_id);
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_snippets_user ON snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets(language);
CREATE INDEX IF NOT EXISTS idx_snippets_type ON snippets(type);
CREATE INDEX IF NOT EXISTS idx_snippets_search ON snippets USING GIN(search_vector);

CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);

CREATE INDEX IF NOT EXISTS idx_bugs_user ON bugs(user_id);
CREATE INDEX IF NOT EXISTS idx_bugs_resolved ON bugs(resolved);
CREATE INDEX IF NOT EXISTS idx_bugs_search ON bugs USING GIN(search_vector);

-- ============================================
-- TRIGGERS FOR SEARCH VECTOR AND UPDATED_AT
-- ============================================

-- Notes search vector trigger
CREATE OR REPLACE FUNCTION update_notes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notes_search_update ON notes;
CREATE TRIGGER notes_search_update
    BEFORE INSERT OR UPDATE OF title, content ON notes
    FOR EACH ROW EXECUTE FUNCTION update_notes_search_vector();

-- Snippets search vector trigger
CREATE OR REPLACE FUNCTION update_snippets_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.content, '') || ' ' || 
        COALESCE(NEW.description, '')
    );
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS snippets_search_update ON snippets;
CREATE TRIGGER snippets_search_update
    BEFORE INSERT OR UPDATE OF title, content, description ON snippets
    FOR EACH ROW EXECUTE FUNCTION update_snippets_search_vector();

-- Bugs search vector trigger
CREATE OR REPLACE FUNCTION update_bugs_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.error_message, '') || ' ' || 
        COALESCE(NEW.root_cause, '') || ' ' || 
        COALESCE(NEW.solution, '')
    );
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bugs_search_update ON bugs;
CREATE TRIGGER bugs_search_update
    BEFORE INSERT OR UPDATE OF title, error_message, root_cause, solution ON bugs
    FOR EACH ROW EXECUTE FUNCTION update_bugs_search_vector();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own notes" ON notes;
DROP POLICY IF EXISTS "Users can manage own snippets" ON snippets;
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can manage own bugs" ON bugs;
DROP POLICY IF EXISTS "Users can manage own categories" ON categories;
DROP POLICY IF EXISTS "Users can manage own tags" ON tags;

-- Create RLS Policies
CREATE POLICY "Users can manage own notes" ON notes 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own snippets" ON snippets 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tasks" ON tasks 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bugs" ON bugs 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own categories" ON categories 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tags" ON tags 
    FOR ALL USING (auth.uid() = user_id);

-- Junction table policies (based on parent table ownership)
CREATE POLICY "Users can manage note_tags" ON note_tags 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid())
    );

CREATE POLICY "Users can manage snippet_tags" ON snippet_tags 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM snippets WHERE snippets.id = snippet_tags.snippet_id AND snippets.user_id = auth.uid())
    );

CREATE POLICY "Users can manage bug_tags" ON bug_tags 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM bugs WHERE bugs.id = bug_tags.bug_id AND bugs.user_id = auth.uid())
    );

CREATE POLICY "Users can manage task_links" ON task_links 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_links.task_id AND tasks.user_id = auth.uid())
    );
