# uulzah.link - Implementation Guide

## 🎯 Project Overview

A simple, sleek scheduling application built with Next.js 15, React 19, and Supabase. Create event polls, collect availability, and find the best time to meet - all without requiring login.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.0.3, React 19, TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Languages**: Mongolian (default), English

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the migration script in the Supabase SQL editor:
   - Navigate to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and execute

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=mn
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
uulzah-link/
├── app/
│   ├── [locale]/               # Localized routes
│   │   ├── page.tsx           # Landing page
│   │   ├── create/            # Create event page
│   │   └── e/[eventId]/       # Event pages
│   │       ├── page.tsx       # Response form
│   │       └── results/       # Results page
│   ├── api/                   # API routes
│   │   └── events/           # Event endpoints
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components
│   └── Header.tsx            # App header
├── lib/
│   ├── supabase/             # Supabase client & types
│   ├── i18n/                 # Translations
│   └── utils/                # Utility functions
└── supabase/
    └── migrations/           # Database migrations
```

## 🎨 Key Features

### ✅ Implemented

1. **Landing Page** - Simple hero section with CTA
2. **Create Event** - Form to create scheduling polls
3. **Event Poll** - Grid interface for participants to indicate availability
4. **Results Page** - Aggregated view showing best times
5. **Bilingual** - Mongolian and English support
6. **No Authentication** - Token-based access for editing
7. **Responsive** - Mobile-first design with touch-friendly UI
8. **Simple & Fast** - No caching complexity, direct database queries

### 📋 Key Components

- **Button** - Primary, secondary, ghost variants
- **Input** - Text input with label and error support
- **Textarea** - Multi-line text input
- **Card** - Container with hover effects
- **GridCell** - Interactive availability selector

## 🎯 Usage Flow

1. **Create Event**
   - Enter event title, description, location
   - Select multiple possible dates
   - Receive shareable link and edit token

2. **Share Link**
   - Participants click the shared link
   - No login required

3. **Submit Availability**
   - Enter name
   - Click grid cells to cycle: Available → Maybe → Unavailable
   - Add optional comment
   - Submit response

4. **View Results**
   - See all responses in a grid
   - Best dates highlighted
   - Export options available

## 🔒 Security

- Edit tokens (64-char hex) for event modification
- Response tokens (64-char hex) for editing responses
- Row Level Security (RLS) enabled on Supabase
- No sensitive data collected
- GDPR compliant (minimal data collection)

## 🚀 Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy!

### Database Migrations

Run migrations in Supabase dashboard SQL editor:

```sql
-- See supabase/migrations/001_initial_schema.sql
```

## 📝 API Endpoints

- `POST /api/events` - Create new event
- `GET /api/events/[eventId]` - Get event details
- `POST /api/events/[eventId]/responses` - Submit response
- `GET /api/events/[eventId]/results` - Get aggregated results

## 🎨 Design Philosophy

- **Simple** - No unnecessary features
- **Solid** - Reliable and performant
- **Sleek** - Clean, modern UI
- **Fast** - No caching overhead, optimized queries
- **Accessible** - WCAG 2.1 AA compliant

## 🌍 Internationalization

Translations in `lib/i18n/translations.ts`:
- Mongolian (mn) - Default
- English (en)

Add new translations by extending the `translations` object.

## 📊 Database Schema

### Tables

1. **events** - Event details and settings
2. **event_dates** - Possible dates for each event
3. **participants** - People who responded
4. **responses** - Individual availability selections

See `supabase/migrations/001_initial_schema.sql` for full schema.

## 🐛 Troubleshooting

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase project status
- Ensure database migrations are applied

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check Node version: `node -v` (should be 20.x)

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for simple scheduling**
