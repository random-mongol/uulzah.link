# CLAUDE.md - Repository Context for AI Assistants

This file provides context about the uulzah.link project for AI assistants like Claude to work more effectively with this codebase.

## Project Overview

**uulzah.link** is a scheduling and polling application for finding the best time for meetings and events, similar to chouseisan.com or Doodle, with Mongolian language support.

- **Type**: Next.js 15 web application
- **Primary Language**: TypeScript
- **Package Manager**: pnpm
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **i18n**: Next.js internationalization (Mongolian + English)

## Current State

### ✅ Completed Setup

- [x] Next.js 15 with App Router configured
- [x] TypeScript and type checking
- [x] Supabase client library installed
- [x] Database schema designed (see migrations)
- [x] Environment variables configured
- [x] Migration files created
- [x] Test scripts created

### ⚠️ Pending Work

- [ ] Database migrations need to be applied to Supabase (see MIGRATION_GUIDE.md)
- [ ] Frontend components implementation
- [ ] API routes implementation
- [ ] Authentication/authorization (currently using permissive RLS policies)
- [ ] Rate limiting
- [ ] Testing setup

### 📝 Known Issues

1. **README.md outdated**: The README mentions "Drizzle ORM" and "Vercel Postgres", but the actual implementation uses Supabase. This is a documentation discrepancy that should be updated.

2. **Database not initialized**: The Supabase project exists but migrations haven't been run yet. See `MIGRATION_GUIDE.md` for instructions.

3. **Supabase CLI installation**: The npm package `supabase` doesn't properly install the CLI binary via pnpm. For CLI operations, install globally or use the Supabase dashboard.

## Repository Structure

```
uulzah-link/
├── app/                          # Next.js App Router (not yet implemented)
│   ├── [locale]/                 # Internationalized routes
│   └── api/                      # API routes
├── components/                   # React components (not yet implemented)
├── lib/
│   └── supabase/
│       ├── client.ts             # Supabase client configuration
│       └── database.types.ts     # Generated TypeScript types
├── scripts/
│   └── test-supabase.ts          # Database connection test script
├── supabase/
│   ├── config.toml               # Supabase CLI configuration
│   └── migrations/
│       ├── 001_initial_schema.sql      # Core database schema
│       └── 002_add_fingerprint.sql     # Fingerprint tracking
├── .env.local                    # Local environment variables (not in git)
├── .env.example                  # Example environment variables
├── MIGRATION_GUIDE.md            # How to apply database migrations
├── SYSTEM_DESIGN.md              # Comprehensive system design document
├── USER_STORIES.md               # User stories and requirements
├── DESIGN.md                     # Design specifications
└── IMPLEMENTATION.md             # Implementation details
```

## Database Schema

The application uses four main tables:

1. **events** - Core event information
   - id (UUID), title, description, location
   - owner_name, owner_email, edit_token
   - timezone, settings, timestamps
   - creator_fingerprint (for device-based editing)

2. **event_dates** - Proposed dates for each event
   - event_id (FK), start_datetime, end_datetime
   - is_all_day, display_order

3. **participants** - People responding to events
   - event_id (FK), name, email, comment
   - response_token (for editing responses)

4. **responses** - Individual availability responses
   - participant_id (FK), event_date_id (FK)
   - status ('yes', 'no', 'maybe')

See `supabase/migrations/001_initial_schema.sql` for the complete schema definition.

## Environment Variables

Required variables (set in `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://poguqhsxcggonechhsnu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=mn
```

## Common Tasks

### Install dependencies
```bash
pnpm install
```

### Run development server
```bash
pnpm dev
```

### Type checking
```bash
pnpm typecheck
```

### Test database connection
```bash
pnpm test:db
```

### Apply database migrations
See `MIGRATION_GUIDE.md` for detailed instructions. The migrations must be applied via:
- Supabase Dashboard SQL Editor (recommended), or
- Supabase CLI (requires global installation)

### Database scripts (require Supabase CLI)
```bash
pnpm db:migrate        # Push migrations to Supabase
pnpm supabase:link     # Link to Supabase project
pnpm supabase:status   # Check migration status
```

## Git Workflow

- **Main branch**: `main` (or as specified in git config)
- **Current feature branch**: `claude/fix-db-migration-supabase-014bNqEDKLXh7Zijyv5kB8y9`
- All work should be committed to the feature branch and pushed when complete

## Development Notes

### Supabase Setup
- Project Reference: `poguqhsxcggonechhsnu`
- Region: Not specified (check Supabase dashboard)
- RLS: Enabled on all tables with permissive policies (development mode)

### Security Considerations
- Row Level Security (RLS) is currently permissive for development
- Production RLS policies should restrict access based on tokens
- edit_token: Used for event owner to make changes
- response_token: Used for participants to edit their responses
- creator_fingerprint: Additional security layer for device-based editing

### Performance
- Indexes created on frequently queried columns
- Foreign keys with ON DELETE CASCADE for data integrity
- Triggers for auto-updating timestamps

### Internationalization
- Default locale: Mongolian (mn)
- Supported locales: mn, en
- Translation files should be in `messages/` directory (not yet created)

## Key Design Decisions

1. **No Authentication Required**: Users don't need accounts to create events or respond
2. **Token-Based Editing**: Access control via unique tokens instead of user sessions
3. **Device Fingerprinting**: Additional layer to prevent unauthorized editing
4. **Timezone Aware**: All timestamps stored with timezone information
5. **Soft Deletes**: Events use deleted_at instead of hard deletion

## Next Steps for Development

1. **Apply Database Migrations** (highest priority)
   - Follow MIGRATION_GUIDE.md
   - Verify with `pnpm test:db`

2. **Update README.md**
   - Fix references to Drizzle/Vercel Postgres
   - Update to reflect Supabase usage

3. **Implement Core Features**
   - Event creation form and API
   - Event response/participation flow
   - Results visualization

4. **Add Testing**
   - Set up Jest/Vitest
   - Add unit tests for utilities
   - Add integration tests for API routes

5. **Implement Security**
   - Strengthen RLS policies
   - Add rate limiting
   - Implement CSRF protection

## Helpful Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Project Design Docs:
  - `SYSTEM_DESIGN.md` - Complete technical specification
  - `USER_STORIES.md` - Feature requirements
  - `DESIGN.md` - UI/UX specifications
  - `IMPLEMENTATION.md` - Implementation guidelines

## Tips for AI Assistants

1. **Always read the migration files** before making database-related changes
2. **Check SYSTEM_DESIGN.md** for architectural decisions before implementing features
3. **Use pnpm** not npm or yarn
4. **TypeScript strict mode** is enabled - ensure type safety
5. **Follow existing patterns** in lib/supabase/ for database operations
6. **Test changes** with `pnpm typecheck` before committing
7. **Update this file** when making significant architectural changes

## Contact

For questions about the project architecture or design decisions, refer to:
- `SYSTEM_DESIGN.md` for technical details
- `USER_STORIES.md` for feature requirements
- Create an issue in the repository for specific problems

---

Last Updated: 2025-11-17
Repository Version: Development (pre-alpha)
Database Status: Schema designed, migrations not yet applied
