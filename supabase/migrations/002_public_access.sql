
-- Enable Public Access for Notes Feature (No Login Required)

-- 1. Categories
DROP POLICY IF EXISTS "Public view categories" ON kb_categories;
CREATE POLICY "Public manage categories" ON kb_categories FOR ALL USING (true);

-- 2. Tags
DROP POLICY IF EXISTS "Tags viewable by everyone" ON kb_tags;
DROP POLICY IF EXISTS "Authenticated users can create tags" ON kb_tags;
CREATE POLICY "Public manage tags" ON kb_tags FOR ALL USING (true);

-- 3. Notes Tables (Work)
DROP POLICY IF EXISTS "Manage own work" ON kb_notes_work;
DROP POLICY IF EXISTS "Read published work" ON kb_notes_work;
CREATE POLICY "Public manage work" ON kb_notes_work FOR ALL USING (true);

-- 4. Notes Tables (Learn)
DROP POLICY IF EXISTS "Manage own learn" ON kb_notes_learn;
DROP POLICY IF EXISTS "Read published learn" ON kb_notes_learn;
CREATE POLICY "Public manage learn" ON kb_notes_learn FOR ALL USING (true);

-- 5. Notes Tables (Ideas)
DROP POLICY IF EXISTS "Manage own ideas" ON kb_notes_ideas;
DROP POLICY IF EXISTS "Read published ideas" ON kb_notes_ideas;
CREATE POLICY "Public manage ideas" ON kb_notes_ideas FOR ALL USING (true);

-- 6. Notes Tables (Life)
DROP POLICY IF EXISTS "Manage own life" ON kb_notes_life;
DROP POLICY IF EXISTS "Read published life" ON kb_notes_life;
CREATE POLICY "Public manage life" ON kb_notes_life FOR ALL USING (true);
