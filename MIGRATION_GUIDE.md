# Database Migration Guide

This guide explains how to apply database migrations to your Supabase project.

## Current Status

- ✅ Supabase client configured
- ✅ Environment variables set in `.env.local`
- ✅ Migration files exist in `supabase/migrations/`
- ⚠️ Migrations need to be applied to remote database

## Migration Files

The following migrations are available:
1. `001_initial_schema.sql` - Creates the core database schema (events, event_dates, participants, responses)
2. `002_add_fingerprint.sql` - Adds fingerprint tracking for event creators

## Option 1: Apply Migrations via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/poguqhsxcggonechhsnu
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run** to execute the migration
6. Repeat for `002_add_fingerprint.sql`

## Option 2: Use Supabase CLI

### Install Supabase CLI globally

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use npm
npm install -g supabase
```

### Link to your project

```bash
# Login to Supabase
supabase login

# Link to your project (you'll need your database password)
supabase link --project-ref poguqhsxcggonechhsnu
```

### Push migrations

```bash
# Push all pending migrations
supabase db push

# Or reset the database (WARNING: This will delete all data)
supabase db reset
```

## Option 3: Manual SQL Execution

If the above options don't work, you can manually run the SQL:

1. Open `supabase/migrations/001_initial_schema.sql` in your editor
2. Copy all the SQL content
3. Go to Supabase Dashboard → SQL Editor
4. Paste and execute
5. Repeat for other migration files

## Verify Migrations

After applying migrations, test the connection:

```bash
pnpm test:db
```

You should see:
```
✅ Successfully connected to Supabase
✅ Table "events" exists and is accessible
✅ Table "event_dates" exists and is accessible
✅ Table "participants" exists and is accessible
✅ Table "responses" exists and is accessible
```

## Database Schema Overview

The database consists of four main tables:

- **events**: Core event information
- **event_dates**: Proposed dates/times for each event
- **participants**: People responding to events
- **responses**: Individual responses (yes/no/maybe) for each date

All tables have Row Level Security (RLS) enabled with permissive policies for development.
