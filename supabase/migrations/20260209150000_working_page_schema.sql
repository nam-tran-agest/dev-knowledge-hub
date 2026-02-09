-- Migration: Working Page Schema (Projects & Enhanced Tasks) - ROBUST VERSION V4
-- Description: Safely adds projects table, enhances tasks, and fixes FK/RLS issues for GUEST_ID support

-- ============================================
-- PROJECTS TABLE & COLUMNS
-- ============================================

-- Create table without hard FK constraint to allow GUEST_ID ('00000000-0000-0000-0000-000000000000')
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Removed REFERENCES auth.users(id)
    name VARCHAR(255) NOT NULL,
    UNIQUE(user_id, name)
);

-- If table already exists with FK, try to drop it
DO $$ 
BEGIN 
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Ensure user_id has a default (auth.uid() for authenticated users)
ALTER TABLE projects ALTER COLUMN user_id SET DEFAULT auth.uid();

DO $$ 
BEGIN 
    -- Projects Table Enchancements
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'description') THEN
        ALTER TABLE projects ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'color') THEN
        ALTER TABLE projects ADD COLUMN color VARCHAR(7) DEFAULT '#6366f1';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'icon') THEN
        ALTER TABLE projects ADD COLUMN icon VARCHAR(50) DEFAULT 'Layout';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'status') THEN
        ALTER TABLE projects ADD COLUMN status VARCHAR(20) CHECK (status IN ('active', 'archived')) DEFAULT 'active';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'order') THEN
        ALTER TABLE projects ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'is_pinned') THEN
        ALTER TABLE projects ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'created_at') THEN
        ALTER TABLE projects ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'updated_at') THEN
        ALTER TABLE projects ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Tasks Table Enhancements
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'project_id') THEN
        ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'priority') THEN
        ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'due_date') THEN
        ALTER TABLE tasks ADD COLUMN due_date TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'tags') THEN
        ALTER TABLE tasks ADD COLUMN tags TEXT[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'status') THEN
        ALTER TABLE tasks ADD COLUMN status VARCHAR(20) CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo';
    END IF;
END $$;

-- Drop FK on tasks too if it exists to allow Guest ID
DO $$ 
BEGIN 
    ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- ============================================
-- TASK_TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- REFINED RLS Policies for Projects (Supports Auth and GUEST_ID)
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
DROP POLICY IF EXISTS "Users can select own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;

CREATE POLICY "projects_select_policy" ON projects FOR SELECT USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "projects_insert_policy" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "projects_update_policy" ON projects FOR UPDATE USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "projects_delete_policy" ON projects FOR DELETE USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');

-- Standardizing Tasks for Guest access
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
DROP POLICY IF EXISTS "tasks_access_policy" ON tasks;
CREATE POLICY "tasks_access_policy" ON tasks FOR ALL USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');

-- Junction table policies
DROP POLICY IF EXISTS "Users can manage task_tags" ON task_tags;
DROP POLICY IF EXISTS "task_tags_access_policy" ON task_tags;
CREATE POLICY "task_tags_access_policy" ON task_tags 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id = '00000000-0000-0000-0000-000000000000'))
    );

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_projects_updated_at();
