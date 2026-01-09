# Database Setup Guide

This guide will help you set up the Supabase database for Dev Knowledge Hub.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Basic familiarity with SQL

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details:
   - **Name**: dev-knowledge-hub (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to you
4. Click "Create new project"
5. Wait for the project to be provisioned (usually takes 1-2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in the left sidebar)
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
4. Save these values - you'll need them for your `.env.local` file

## Step 3: Run the Database Migration

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, navigate to **SQL Editor** (table icon in the left sidebar)
2. Click "+ New query"
3. Open the file `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents
5. Paste it into the SQL Editor
6. Click "Run" or press Ctrl/Cmd + Enter
7. You should see "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 4: Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `bugs`
   - `bug_tags`
   - `categories`
   - `notes`
   - `note_tags`
   - `snippets`
   - `snippet_tags`
   - `tags`
   - `tasks`
   - `task_links`

3. Click on any table to view its structure
4. Verify that Row Level Security (RLS) is enabled for all tables

## Step 5: Test Authentication

1. Go to **Authentication** → **Settings**
2. Make sure "Enable email confirmations" is turned ON
3. Under "Email Auth", ensure it's enabled
4. Test the magic link authentication:
   - Run your development server
   - Go to the login page
   - Enter your email
   - Check your inbox for the magic link
   - Click the link to authenticate

## Database Schema Overview

### Core Tables

**notes**
- Stores user notes with rich text content
- Linked to categories and tags
- Full-text search enabled

**snippets**
- Stores code snippets and AI prompts
- Supports multiple programming languages
- Searchable by content and language

**tasks**
- Task management with Kanban board support
- Three statuses: todo, doing, done
- Can be linked to notes and snippets

**bugs**
- Bug tracking with error details
- Stores stack traces and solutions
- Can be marked as resolved

**categories**
- Organize notes by category
- Each category has a custom color

**tags**
- Tag system for notes, snippets, and bugs
- Many-to-many relationships via junction tables

### Junction Tables

- `note_tags`: Links notes to tags
- `snippet_tags`: Links snippets to tags
- `bug_tags`: Links bugs to tags
- `task_links`: Links tasks to notes/snippets

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- Users can only access their own data
- All operations (SELECT, INSERT, UPDATE, DELETE) are restricted by `user_id`
- Junction tables inherit permissions from parent tables

## Full-Text Search

The following tables have full-text search configured:

- **notes**: Searches title and content
- **snippets**: Searches title, content, and description
- **bugs**: Searches title, error message, root cause, and solution

Search vectors are automatically updated via PostgreSQL triggers.

## Indexes

The following indexes are created for optimal performance:

- User-based indexes for quick filtering
- Search vector indexes for full-text search
- Foreign key indexes for joins
- Position indexes for task ordering

## Troubleshooting

### Issue: Tables not created

**Solution**: Make sure you ran the entire migration script. Check the SQL Editor for any error messages.

### Issue: RLS policies not working

**Solution**: Verify that you're authenticated. RLS policies require a valid user session.

### Issue: Search not working

**Solution**: Ensure the search vector triggers were created. They should automatically update when inserting/updating records.

### Issue: Can't insert data

**Solution**: Check that:
1. You're authenticated (have a valid session)
2. RLS policies are correctly configured
3. Required fields are provided

### Issue: Duplicate key errors

**Solution**: Some tables have unique constraints (e.g., `categories` and `tags` have unique names per user). Make sure you're not creating duplicates.

## Maintenance

### Backup Your Data

Regularly backup your data from the Supabase dashboard:
1. Go to **Database** → **Backups**
2. Enable automatic daily backups (available on paid plans)
3. Or manually export tables using the SQL Editor

### Monitor Performance

1. Check query performance in **Database** → **Query Performance**
2. Monitor table sizes and index usage
3. Optimize queries if needed

### Update Schema

If you need to make schema changes:
1. Create a new migration file
2. Test it locally first
3. Run it in production during low-traffic periods
4. Always backup before making changes

## Support

If you encounter issues:
- Check the Supabase documentation: https://supabase.com/docs
- Review the project README
- Open an issue on GitHub
- Check existing issues for solutions

## Next Steps

After setting up the database:
1. Configure your `.env.local` with the API credentials
2. Run the development server: `npm run dev`
3. Create your first user account
4. Start using the app!
