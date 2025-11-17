# uulzah.link - System Design Document

**Version:** 1.0
**Last Updated:** 2025-11-17
**Status:** Design Phase

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [API Design](#api-design)
6. [Key Features](#key-features)
7. [Deployment Strategy](#deployment-strategy)
8. [Performance Considerations](#performance-considerations)
9. [Scalability](#scalability)
10. [Security Considerations](#security-considerations)
11. [Internationalization](#internationalization)

---

## Executive Summary

**uulzah.link** is a lightweight, fast scheduling and polling application inspired by chouseisan.com. It allows users to create scheduling polls with multiple date/time options and share them with participants who can indicate their availability without requiring authentication.

### Core Principles
- **Simplicity**: No login required, minimal friction
- **Speed**: Fast page loads, optimistic UI updates
- **Privacy**: No personal data collection beyond what's necessary
- **Accessibility**: Clean, intuitive interface with Mongolian language support

---

## Tech Stack

### Frontend
- **Next.js**: `15.0.3` (App Router)
- **React**: `19.0.0`
- **TypeScript**: `5.6.x`
- **Styling**:
  - Tailwind CSS `3.4.x`
  - CSS Modules (as needed)
- **UI Components**:
  - Radix UI primitives `1.x` (accessible, unstyled components)
  - Headless UI `2.x` (as alternative/supplement)
- **Form Handling**:
  - React Hook Form `7.x`
  - Zod `3.x` (schema validation)
- **Date/Time Management**:
  - date-fns `3.x` (lightweight, tree-shakeable)
  - date-fns-tz `3.x` (timezone support)
- **State Management**:
  - React Server Components (default)
  - Zustand `4.x` (client-side state when needed)
- **HTTP Client**:
  - Native fetch API

### Backend
- **Runtime**: Node.js `20.x`
- **Framework**: Next.js API Routes (App Router)
- **Database**: Vercel Postgres (based on Neon)
- **ORM**:
  - Drizzle ORM `0.33.x` (lightweight, type-safe)
  - Alternative: Prisma `5.x` (more features, larger bundle)
- **Validation**: Zod `3.x`
- **Rate Limiting**: Simple in-memory or database-based rate limiting

### Infrastructure
- **Hosting**: Vercel
- **Database**: Vercel Postgres
- **Analytics**: Vercel Analytics
- **Monitoring**: Vercel Logs + Sentry (optional)

### Development Tools
- **Package Manager**: pnpm `9.x`
- **Linting**: ESLint `9.x`
- **Formatting**: Prettier `3.x`
- **Testing**:
  - Vitest `2.x` (unit tests)
  - Playwright `1.x` (e2e tests)
- **Git Hooks**: Husky `9.x` + lint-staged

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE NETWORK                  │
│                    (Global CDN + Edge Functions)             │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      NEXT.JS APPLICATION                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Router (React 19)                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │   API      │  │  Server    │    │  │
│  │  │ (RSC+SSR)  │  │  Routes    │  │ Components │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌───────────────┐
                    │ Vercel        │
                    │ Postgres      │
                    │               │
                    │ - Events      │
                    │ - Responses   │
                    │ - Analytics   │
                    └───────────────┘
```

### Component Architecture

```
app/
├── [locale]/                          # Internationalization
│   ├── page.tsx                       # Home page
│   ├── create/
│   │   └── page.tsx                   # Create event form
│   ├── e/
│   │   └── [eventId]/
│   │       ├── page.tsx               # View/respond to event
│   │       ├── edit/
│   │       │   └── page.tsx           # Edit event (owner only)
│   │       └── results/
│   │           └── page.tsx           # View results
│   └── layout.tsx                     # Root layout
├── api/
│   ├── events/
│   │   ├── route.ts                   # POST /api/events (create)
│   │   └── [eventId]/
│   │       ├── route.ts               # GET, PATCH, DELETE
│   │       └── responses/
│   │           └── route.ts           # POST responses
│   └── health/
│       └── route.ts                   # Health check
└── components/
    ├── event-form.tsx                 # Create/edit event
    ├── response-form.tsx              # Participant response
    ├── availability-grid.tsx          # Visual availability matrix
    └── share-dialog.tsx               # Share modal
```

### Request Flow

1. **Create Event**:
   ```
   User → Form → POST /api/events → Postgres → Event ID → Redirect
   ```

2. **View Event**:
   ```
   User → GET /e/[id] → Server Component → Postgres → Render → HTML
   ```

3. **Submit Response**:
   ```
   Participant → Form → POST /api/events/[id]/responses → Postgres → Revalidate → Redirect
   ```

4. **View Results**:
   ```
   User → GET /e/[id]/results → Server Component → Postgres → Aggregate Data → Render
   ```

---

## Database Schema

### Overview
Using Vercel Postgres (PostgreSQL 15+) with the following design principles:
- Denormalization where appropriate for read performance
- UUIDs for public-facing IDs
- Timestamps for all entities
- Soft deletes where necessary
- Indexes on frequently queried columns

### Tables

#### 1. `events`
The main scheduling poll/event table.

```sql
CREATE TABLE events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(500),

  -- Owner Information (optional, no auth)
  owner_name VARCHAR(100),
  owner_email VARCHAR(255),

  -- Security
  edit_token VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 hash for edit access

  -- Settings
  timezone VARCHAR(100) DEFAULT 'Asia/Ulaanbaatar',
  allow_multiple_dates BOOLEAN DEFAULT true,
  allow_maybe BOOLEAN DEFAULT true,
  show_responses_after_submit BOOLEAN DEFAULT true,
  deadline_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,

  -- Indexes
  CONSTRAINT events_title_length CHECK (char_length(title) >= 3)
);

-- Indexes
CREATE INDEX idx_events_created_at ON events(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_edit_token ON events(edit_token) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_updated_at ON events(updated_at DESC);
```

#### 2. `event_dates`
Date/time options for each event.

```sql
CREATE TABLE event_dates (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Foreign Key
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Date/Time Information
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  is_all_day BOOLEAN DEFAULT false,

  -- Display Order
  display_order INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT event_dates_valid_range CHECK (
    end_datetime IS NULL OR end_datetime > start_datetime
  )
);

-- Indexes
CREATE INDEX idx_event_dates_event_id ON event_dates(event_id, display_order);
CREATE INDEX idx_event_dates_start_time ON event_dates(start_datetime);
```

#### 3. `participants`
People who have responded to events.

```sql
CREATE TABLE participants (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Foreign Key
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Participant Information
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),  -- Optional for notifications
  comment TEXT,

  -- Security
  response_token VARCHAR(64) NOT NULL UNIQUE,  -- For editing responses

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate names per event
  CONSTRAINT participants_unique_name_per_event UNIQUE(event_id, name)
);

-- Indexes
CREATE INDEX idx_participants_event_id ON participants(event_id, created_at);
CREATE INDEX idx_participants_response_token ON participants(response_token);
```

#### 4. `responses`
Individual availability responses for each date option.

```sql
CREATE TABLE responses (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Foreign Keys
  participant_id BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  event_date_id BIGINT NOT NULL REFERENCES event_dates(id) ON DELETE CASCADE,

  -- Response
  status VARCHAR(10) NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint: one response per participant per date
  CONSTRAINT responses_unique_participant_date UNIQUE(participant_id, event_date_id)
);

-- Indexes
CREATE INDEX idx_responses_participant_id ON responses(participant_id);
CREATE INDEX idx_responses_event_date_id ON responses(event_date_id);

-- Composite index for aggregation queries
CREATE INDEX idx_responses_date_status ON responses(event_date_id, status);
```

#### 5. `event_analytics` (optional)
Track detailed analytics for insights.

```sql
CREATE TABLE event_analytics (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Foreign Key
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Event Type
  event_type VARCHAR(50) NOT NULL,  -- 'view', 'share', 'response', 'edit'

  -- Metadata
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  country_code VARCHAR(2),

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_event_id ON event_analytics(event_id, created_at DESC);
CREATE INDEX idx_analytics_event_type ON event_analytics(event_type, created_at DESC);
CREATE INDEX idx_analytics_created_at ON event_analytics(created_at DESC);
```

### Database Migrations

Using Drizzle Kit for migrations:

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
```

---

## API Design

### Principles
- RESTful conventions
- JSON request/response bodies
- Proper HTTP status codes
- Rate limiting on all endpoints
- Input validation with Zod

### Endpoints

#### 1. Create Event
```http
POST /api/events
Content-Type: application/json

Request Body:
{
  "title": "Team Planning Meeting",
  "description": "Quarterly planning session",
  "location": "Office or Zoom",
  "ownerName": "Ganbaatar",
  "ownerEmail": "ganbaatar@example.com",
  "timezone": "Asia/Ulaanbaatar",
  "dates": [
    {
      "startDatetime": "2025-11-20T14:00:00+08:00",
      "endDatetime": "2025-11-20T15:00:00+08:00",
      "isAllDay": false
    },
    {
      "startDatetime": "2025-11-21T14:00:00+08:00",
      "endDatetime": "2025-11-21T15:00:00+08:00",
      "isAllDay": false
    }
  ],
  "settings": {
    "allowMultipleDates": true,
    "allowMaybe": true,
    "showResponsesAfterSubmit": true,
    "deadlineAt": "2025-11-19T23:59:59+08:00"
  }
}

Response (201 Created):
{
  "eventId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "editToken": "7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8",
  "shareUrl": "https://uulzah.link/e/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "editUrl": "https://uulzah.link/e/a1b2c3d4-e5f6-7890-abcd-ef1234567890/edit?token=..."
}

Errors:
- 400: Invalid input
- 429: Rate limit exceeded (max 10 events per hour per IP)
- 500: Server error
```

#### 2. Get Event Details
```http
GET /api/events/:eventId

Response (200 OK):
{
  "event": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Team Planning Meeting",
    "description": "Quarterly planning session",
    "location": "Office or Zoom",
    "ownerName": "Ganbaatar",
    "timezone": "Asia/Ulaanbaatar",
    "settings": {
      "allowMultipleDates": true,
      "allowMaybe": true,
      "showResponsesAfterSubmit": true,
      "deadlineAt": "2025-11-19T23:59:59+08:00"
    },
    "createdAt": "2025-11-17T10:00:00Z",
    "updatedAt": "2025-11-17T10:00:00Z"
  },
  "dates": [
    {
      "id": 1,
      "startDatetime": "2025-11-20T14:00:00+08:00",
      "endDatetime": "2025-11-20T15:00:00+08:00",
      "isAllDay": false,
      "displayOrder": 0
    }
  ],
  "participants": [
    {
      "id": 1,
      "name": "Batbold",
      "comment": "Looking forward to it!",
      "createdAt": "2025-11-17T11:00:00Z"
    }
  ],
  "responses": [
    {
      "participantId": 1,
      "eventDateId": 1,
      "status": "yes"
    }
  ]
}

Errors:
- 404: Event not found
- 410: Event deleted
```

#### 3. Update Event
```http
PATCH /api/events/:eventId
Content-Type: application/json
X-Edit-Token: 7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8

Request Body (partial update):
{
  "title": "Updated Meeting Title",
  "description": "New description"
}

Response (200 OK):
{
  "success": true,
  "event": { /* updated event */ }
}

Errors:
- 401: Invalid or missing edit token
- 404: Event not found
- 409: Conflict (concurrent update)
```

#### 4. Delete Event
```http
DELETE /api/events/:eventId
X-Edit-Token: 7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8

Response (200 OK):
{
  "success": true,
  "message": "Event deleted successfully"
}

Errors:
- 401: Invalid or missing edit token
- 404: Event not found
```

#### 5. Submit Response
```http
POST /api/events/:eventId/responses
Content-Type: application/json

Request Body:
{
  "participantName": "Batbold",
  "participantEmail": "batbold@example.com",  // optional
  "comment": "Looking forward to it!",
  "responses": [
    {
      "eventDateId": 1,
      "status": "yes"
    },
    {
      "eventDateId": 2,
      "status": "maybe"
    }
  ]
}

Response (201 Created):
{
  "participantId": 1,
  "responseToken": "9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3z2y1x0w9v8u",
  "message": "Response submitted successfully"
}

Errors:
- 400: Invalid input
- 404: Event not found
- 409: Participant name already exists (must be unique per event)
- 410: Event deadline passed
- 429: Rate limit exceeded
```

#### 6. Update Response
```http
PATCH /api/events/:eventId/responses/:participantId
Content-Type: application/json
X-Response-Token: 9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3z2y1x0w9v8u

Request Body:
{
  "responses": [
    {
      "eventDateId": 1,
      "status": "no"
    }
  ]
}

Response (200 OK):
{
  "success": true,
  "message": "Response updated successfully"
}

Errors:
- 401: Invalid or missing response token
- 404: Participant not found
```

#### 7. Get Event Results
```http
GET /api/events/:eventId/results

Response (200 OK):
{
  "eventId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "summary": {
    "totalParticipants": 5,
    "totalResponses": 10,
    "mostPopularDates": [
      {
        "eventDateId": 1,
        "startDatetime": "2025-11-20T14:00:00+08:00",
        "yesCount": 4,
        "maybeCount": 1,
        "noCount": 0,
        "participants": ["Batbold", "Ganbaatar", "Tsetseg", "Dorj"]
      }
    ]
  },
  "dateResults": [
    {
      "eventDateId": 1,
      "startDatetime": "2025-11-20T14:00:00+08:00",
      "yesCount": 4,
      "maybeCount": 1,
      "noCount": 0,
      "percentage": 80
    }
  ]
}

Errors:
- 404: Event not found
```

### Rate Limiting

Simple database-based rate limiting:

```typescript
// lib/rate-limit.ts
import { db } from './db';

export async function checkRateLimit(
  identifier: string,
  action: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);

  // Count recent actions
  const count = await db
    .select({ count: sql`count(*)` })
    .from(rateLimits)
    .where(
      and(
        eq(rateLimits.identifier, identifier),
        eq(rateLimits.action, action),
        gte(rateLimits.timestamp, windowStart)
      )
    );

  if (count[0].count >= limit) {
    return false;
  }

  // Record this action
  await db.insert(rateLimits).values({
    identifier,
    action,
    timestamp: new Date(),
  });

  return true;
}

// Usage:
// - Create event: 10 per hour per IP
// - Submit response: 20 per 15 min per IP
// - View event: Basic throttling only for abuse prevention
```

### Error Response Format

Consistent error response structure:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  };
}

// Example
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "fields": {
        "title": "Title must be at least 3 characters"
      }
    },
    "timestamp": "2025-11-17T10:00:00Z"
  }
}
```

---

## Key Features

### 1. Event Creation
- **Multi-date Selection**: Calendar interface for selecting multiple date/time options
- **Flexible Timing**: Support for all-day events and time ranges
- **Timezone Support**: Automatic timezone detection with manual override
- **Rich Description**: Markdown support for event descriptions
- **Deadline**: Optional response deadline with automatic closure
- **Customization**: Toggle features (multiple dates, maybe option, show responses)

**User Flow**:
```
1. User lands on homepage
2. Clicks "Create New Event" (Шинэ үйл явдал үүсгэх)
3. Fills form:
   - Event title (required)
   - Description (optional)
   - Location (optional)
   - Owner name (optional)
   - Date/time options (min 1, max 50)
   - Settings checkboxes
4. Submits form
5. Receives:
   - Share URL (for participants)
   - Edit URL with token (save/bookmark)
6. Can immediately share or view event
```

### 2. Event Participation
- **No Login Required**: Simple name-based participation
- **Response Options**: Yes/No/Maybe with visual indicators (✓/✗/?)
- **Comments**: Optional comment per participant
- **Real-time Updates**: Live response counter
- **Edit Responses**: Return with response token to edit
- **Email Notifications**: Optional email for response confirmations

**User Flow**:
```
1. Participant receives share URL
2. Opens event page, sees:
   - Event details
   - Date options
   - Existing responses (if enabled)
3. Enters name
4. Selects availability for each date
5. Adds optional comment
6. Submits
7. Sees confirmation with:
   - Response summary
   - Edit link (save for later)
   - Full results (if enabled)
```

### 3. Results Visualization
- **Availability Grid**: Matrix view showing all participants × dates
- **Summary Stats**:
  - Most popular dates (highest yes count)
  - Total participants
  - Response rate
- **Best Dates Highlight**: Automatic highlighting of dates with most availability
- **Export Options**:
  - Copy to clipboard
  - Download as CSV
  - Generate iCalendar (.ics) for winning date
- **Visual Indicators**:
  - Green (yes)
  - Yellow (maybe)
  - Red (no)
  - Gray (no response)

### 4. Event Management
- **Edit Event**: Update details, add/remove dates (requires edit token)
- **Delete Event**: Soft delete with 30-day retention
- **Share Options**:
  - Direct link
  - QR code
  - Email (future)
  - Social media (future)
- **Response Management**: Owner can delete spam responses

### 5. Mongolian Language Support
- **Full Translation**: All UI text in Mongolian
- **RTL Support**: Proper text rendering
- **Date Formatting**: Mongolian date/time formats
- **Input Validation**: Cyrillic name support

**Translation Structure**:
```typescript
// messages/mn.json
{
  "home": {
    "title": "Үйл явдлын товыг үүсгэх",
    "create_button": "Шинэ үйл явдал үүсгэх",
    "how_it_works": "Яагаад ажилладаг вэ?"
  },
  "event": {
    "title": "Гарчиг",
    "description": "Тайлбар",
    "location": "Байршил",
    "dates": "Огноонууд",
    "participants": "Оролцогчид",
    "responses": "Хариултууд"
  },
  "response": {
    "yes": "Тийм",
    "no": "Үгүй",
    "maybe": "Магадгүй"
  }
}
```

### 6. Responsive Design
- **Mobile First**: Touch-optimized interface
- **Desktop Enhanced**: Keyboard shortcuts, hover states
- **Accessibility**: WCAG 2.1 AA compliance
  - Screen reader support
  - Keyboard navigation
  - High contrast mode
  - Focus indicators

### 7. Performance Features
- **Optimistic UI**: Instant feedback on interactions
- **Progressive Enhancement**: Works without JavaScript for basic features
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Route-based chunking
- **Lazy Loading**: Below-fold content
- **Prefetching**: Link prefetching for instant navigation

---

## Deployment Strategy

### Vercel Configuration

#### 1. Project Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add POSTGRES_URL
vercel env add POSTGRES_PRISMA_URL
vercel env add POSTGRES_URL_NO_SSL
vercel env add POSTGRES_URL_NON_POOLING
```

#### 2. vercel.json
```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sin1", "hnd1"],
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/refresh-analytics",
      "schedule": "*/5 * * * *"
    }
  ],
  "headers": []
}
```

#### 3. Database Setup
```bash
# Create Vercel Postgres database
vercel postgres create

# Run migrations
pnpm drizzle-kit push:pg

# Seed database (optional)
pnpm run db:seed
```

#### 4. Environment Variables

**Production**:
```env
# Database (auto-configured by Vercel)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=

# Application
NEXT_PUBLIC_APP_URL=https://uulzah.link
NEXT_PUBLIC_DEFAULT_LOCALE=mn

# Optional
SENTRY_DSN=
VERCEL_ANALYTICS_ID=
```

**Development**:
```env
# Local database
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/uulzah_dev

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=mn
```

### CI/CD Pipeline

Automatic deployment on push to main:

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:e2e

  deploy:
    needs: [lint, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Deployment Checklist

**Pre-deployment**:
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Seeds run (if needed)
- [ ] Tests passing
- [ ] Build successful locally
- [ ] Performance budget met

**Post-deployment**:
- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] Redis/KV connection working
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] SSL certificate valid

### Rollback Strategy

```bash
# Instant rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Domain Configuration

```bash
# Add custom domain
vercel domains add uulzah.link

# Add alias
vercel alias set [deployment-url] uulzah.link

# Configure DNS
# A record: 76.76.21.21
# CNAME: cname.vercel-dns.com
```

---

## Performance Considerations

### 1. Database Optimization

#### Connection Pooling
```typescript
// lib/db.ts
import { Pool } from '@vercel/postgres';

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### Prepared Statements
```typescript
// Use Drizzle ORM which auto-prepares statements
const event = await db
  .select()
  .from(events)
  .where(eq(events.id, eventId))
  .prepare('get_event')
  .execute();
```

#### Indexes Strategy
```sql
-- Covering indexes for common queries
CREATE INDEX idx_event_response_lookup
ON responses(event_date_id, status)
INCLUDE (participant_id);

-- Partial indexes for active events
CREATE INDEX idx_active_events
ON events(created_at)
WHERE deleted_at IS NULL;
```

#### Query Optimization
```typescript
// Bad: N+1 query
async function getEventWithResponses(eventId: string) {
  const event = await getEvent(eventId);
  const dates = await getDates(eventId);
  for (const date of dates) {
    date.responses = await getResponses(date.id); // N queries!
  }
  return { event, dates };
}

// Good: Single query with joins
async function getEventWithResponses(eventId: string) {
  return await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      dates: {
        with: {
          responses: {
            with: {
              participant: true,
            },
          },
        },
      },
    },
  });
}
```

### 2. Frontend Optimization

#### Code Splitting
```typescript
// Lazy load heavy components
const AvailabilityGrid = dynamic(
  () => import('@/components/availability-grid'),
  {
    loading: () => <Skeleton />,
    ssr: false, // Don't SSR if not needed
  }
);
```

#### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority={false}
  placeholder="blur"
  quality={85}
/>
```

#### Bundle Analysis
```bash
# Add to package.json scripts
"analyze": "ANALYZE=true next build"

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ...config
});
```

### 3. Performance Metrics

**Target Metrics**:
- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.0s
- **Largest Contentful Paint (LCP)**: < 2.0s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Total Blocking Time (TBT)**: < 200ms

**Monitoring**:
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

### 4. Asset Optimization

- **Images**: WebP/AVIF format, responsive sizes
- **Fonts**: Variable fonts, preload, font-display: swap
- **Icons**: SVG sprites or icon fonts
- **CSS**: Tailwind JIT mode, purge unused
- **JavaScript**: Tree shaking, minification

---

## Scalability

### Horizontal Scaling

#### Vercel Automatic Scaling
- **Function Scaling**: Automatic based on demand
- **Edge Network**: Global CDN distribution
- **No Configuration**: Zero-config scaling

#### Database Scaling

**Vercel Postgres (Neon)**:
- **Connection Pooling**: PgBouncer built-in
- **Auto-scaling**: Compute scales automatically
- **Read Replicas**: For read-heavy workloads (if needed)

```typescript
// Use connection pooling URL for serverless functions
const dbUrl = process.env.POSTGRES_PRISMA_URL; // Uses pgbouncer
```


### Vertical Scaling Limits

| Resource | Free | Pro | Enterprise |
|----------|------|-----|------------|
| Execution Time | 10s | 60s | 900s |
| Memory | 1024MB | 3009MB | 3009MB |
| Bandwidth | 100GB | 1TB | Custom |
| DB Storage | 256MB | 256MB | Custom |
| DB Compute | 0.25 CU | 0.25 CU | Custom |

### Capacity Planning

**Assumptions**:
- Average event: 20 date options, 10 participants = 200 responses
- Average DB row size: ~1KB per response
- 1000 active events = ~200MB storage
- 10,000 views/day = ~100 requests/minute

**Database Storage**:
```
Yearly projection:
- 10,000 events/year
- 200 responses/event average
- 1KB per response
= 10,000 × 200 × 1KB = 2GB/year
```

**Bandwidth**:
```
Daily bandwidth:
- 10,000 views/day
- 50KB per page load
= 500MB/day = 15GB/month
```

### Load Balancing

Handled automatically by Vercel:
- Edge Network (CDN)
- Automatic region selection
- DDoS protection
- Health checks

### Monitoring & Alerts

```typescript
// Sentry integration for error tracking
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['uulzah.link'],
    }),
  ],
});
```

**Alert Thresholds**:
- Error rate > 5%
- Response time > 3s (p95)
- Database connection errors
- Rate limit violations > 100/hour

---

## Security Considerations

### 1. Input Validation

#### Server-side Validation (Zod)
```typescript
// lib/validations.ts
import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().max(5000).optional(),
  location: z.string().max(500).optional(),
  ownerName: z.string().max(100).optional(),
  ownerEmail: z.string().email().optional(),
  timezone: z.string(),
  dates: z.array(
    z.object({
      startDatetime: z.string().datetime(),
      endDatetime: z.string().datetime().optional(),
      isAllDay: z.boolean().default(false),
    })
  ).min(1).max(50),
  settings: z.object({
    allowMultipleDates: z.boolean().default(true),
    allowMaybe: z.boolean().default(true),
    showResponsesAfterSubmit: z.boolean().default(true),
    deadlineAt: z.string().datetime().optional(),
  }),
});
```

### 2. XSS Prevention

- **Content Security Policy**:
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' vercel.com;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];
```

- **DOMPurify** for user-generated content:
```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeContent(content: string) {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}
```

### 3. CSRF Protection

- **SameSite Cookies** (for future session-based features):
```typescript
cookies().set('token', value, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 1 week
});
```

### 4. Rate Limiting

Implemented with Vercel KV (see API Design section).

### 5. SQL Injection Prevention

Using Drizzle ORM with parameterized queries:
```typescript
// Safe: parameterized
const event = await db
  .select()
  .from(events)
  .where(eq(events.id, eventId)); // Auto-parameterized

// Never do this:
// const result = await db.execute(
//   `SELECT * FROM events WHERE id = '${eventId}'` // UNSAFE!
// );
```

### 6. Secrets Management

- **Environment Variables**: Never commit secrets
- **Vercel Env**: Encrypted at rest
- **Token Generation**:
```typescript
import { randomBytes } from 'crypto';

function generateSecureToken(): string {
  return randomBytes(32).toString('hex'); // 64 chars
}
```

### 7. Access Control

- **Edit Token**: Required to modify events
- **Response Token**: Required to edit responses
- **Token Comparison**: Timing-safe comparison
```typescript
import { timingSafeEqual } from 'crypto';

function verifyToken(provided: string, stored: string): boolean {
  if (provided.length !== stored.length) return false;
  const bufferProvided = Buffer.from(provided, 'utf8');
  const bufferStored = Buffer.from(stored, 'utf8');
  return timingSafeEqual(bufferProvided, bufferStored);
}
```

### 8. Data Privacy

- **GDPR Compliance**:
  - Right to access: Export responses
  - Right to erasure: Delete events/responses
  - Data minimization: Only collect necessary data
  - Retention policy: Auto-delete after 1 year of inactivity

- **Privacy Policy**: Clear disclosure of data usage
- **No Tracking**: No unnecessary cookies or tracking

---

## Internationalization

### Next.js i18n Setup

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['mn', 'en'];
const defaultLocale = 'mn';

function getLocale(request: NextRequest): string {
  const headers = {
    'accept-language': request.headers.get('accept-language') ?? 'mn',
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if locale is in pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to locale-prefixed URL
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Translation Files

```typescript
// messages/mn.json
{
  "meta": {
    "title": "uulzah.link - Үйл явдлын товыг үүсгэх",
    "description": "Хурдан бөгөөд энгийн үйл явдлын товыг үүсгэн найз нөхөд болон хамт олонтойгоо хуваалцаарай"
  },
  "home": {
    "hero": {
      "title": "Үйл явдлын товыг үүсгэх",
      "subtitle": "Найз нөхөд болон хамт олонтойгоо хамгийн тохиромжтой цагийг олоорой",
      "cta": "Шинэ үйл явдал үүсгэх"
    },
    "features": {
      "title": "Яагаад uulzah.link вэ?",
      "simple": {
        "title": "Энгийн бөгөөд хурдан",
        "description": "Бүртгэл шаардлагагүй. Хэдхэн товшилтоор үйл явдал үүсгэнэ"
      },
      "share": {
        "title": "Амархан хуваалцах",
        "description": "Холбоос эсвэл QR код ашиглан оролцогчдод хуваалцаарай"
      },
      "realtime": {
        "title": "Бодит цагийн хариу",
        "description": "Оролцогчид хариулт өгөх тусам шууд харагдана"
      }
    }
  },
  "event": {
    "form": {
      "title": "Гарчиг",
      "titlePlaceholder": "Уулзалтын гарчиг",
      "description": "Тайлбар",
      "descriptionPlaceholder": "Уулзалтын тухай дэлгэрэнгүй...",
      "location": "Байршил",
      "locationPlaceholder": "Zoom эсвэл оффис",
      "ownerName": "Таны нэр",
      "ownerNamePlaceholder": "Ганбаатар",
      "dates": "Боломжит огноонууд",
      "addDate": "Огноо нэмэх",
      "settings": "Тохиргоо",
      "allowMultiple": "Олон огноо сонгох боломжтой",
      "allowMaybe": "'Магадгүй' хариулт зөвшөөрөх",
      "showResponses": "Хариулт өгсний дараа бусад хариултыг харуулах",
      "deadline": "Хариулах хугацаа",
      "submit": "Үйл явдал үүсгэх",
      "cancel": "Болих"
    },
    "share": {
      "title": "Үйл явдал үүсгэсэн",
      "description": "Дараах холбоосыг оролцогчдод хуваалцаарай",
      "shareLink": "Хуваалцах холбоос",
      "editLink": "Засварлах холбоос",
      "editWarning": "Засварлах холбоосыг хадгална уу! Үүнийг ашиглан үйл явдлыг өөрчлөх боломжтой",
      "copy": "Хуулах",
      "copied": "Хуулсан",
      "qrCode": "QR код"
    }
  },
  "response": {
    "form": {
      "title": "Таны хариулт",
      "name": "Таны нэр",
      "namePlaceholder": "Батболд",
      "email": "Имэйл (заавал биш)",
      "emailPlaceholder": "batbold@example.com",
      "comment": "Тайлбар (заавал биш)",
      "commentPlaceholder": "Тэсэн ядан хүлээж байна!",
      "availability": "Таны боломж",
      "yes": "Тийм",
      "no": "Үгүй",
      "maybe": "Магадгүй",
      "submit": "Хариулт илгээх",
      "update": "Хариулт шинэчлэх"
    },
    "success": {
      "title": "Хариулт амжилттай илгээгдлэв",
      "editLink": "Хариултаа засах холбоос",
      "editWarning": "Энэ холбоосыг хадгалж дараа өөрчлөх боломжтой",
      "viewResults": "Үр дүн харах"
    }
  },
  "results": {
    "title": "Үр дүн",
    "summary": {
      "participants": "Оролцогчид",
      "responses": "Хариултууд",
      "bestDates": "Хамгийн тохиромжтой огноонууд"
    },
    "grid": {
      "participant": "Оролцогч",
      "yesCount": "Тийм гэсэн",
      "noCount": "Үгүй гэсэн",
      "maybeCount": "Магадгүй гэсэн"
    },
    "export": {
      "copy": "Хуулах",
      "csv": "CSV татах",
      "ical": "Календарт нэмэх"
    }
  },
  "errors": {
    "notFound": "Үйл явдал олдсонгүй",
    "expired": "Үйл явдлын хугацаа дууссан",
    "invalidToken": "Буруу эсвэл хүчингүй токен",
    "duplicateName": "Энэ нэр аль хэдийн ашиглагдсан байна",
    "serverError": "Серверийн алдаа гарлаа. Дахин оролдоно уу"
  }
}
```

### RTL Support (Future)

```css
/* globals.css */
[dir='rtl'] {
  direction: rtl;
}

[dir='rtl'] .text-left {
  text-align: right;
}

[dir='rtl'] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}
```

---

## Future Enhancements

### Phase 2 Features
1. **Email Notifications**:
   - Response confirmations
   - Reminder emails before deadline
   - Winner date announcement

2. **Calendar Integration**:
   - Google Calendar sync
   - Outlook Calendar sync
   - .ics file export

3. **Advanced Analytics**:
   - Response time tracking
   - Popular time slots
   - Geographic distribution

4. **Event Templates**:
   - Common event types (meetings, parties, etc.)
   - Quick create from template

### Phase 3 Features
1. **User Accounts (Optional)**:
   - Save event history
   - Favorite events
   - Email preferences

2. **Recurring Events**:
   - Weekly/monthly repeating polls
   - Standing meetings

3. **Mobile Apps**:
   - React Native iOS/Android apps
   - Push notifications

4. **API for Integrations**:
   - Public API for third-party apps
   - Slack/Discord bots
   - Webhook support

---

## Appendix

### A. Technology Comparison

| Feature | Next.js 15 | Next.js 14 | Remix |
|---------|-----------|-----------|-------|
| App Router | Stable | Stable | - |
| React 19 | Yes | No | No |
| Server Components | Yes | Yes | No |
| Edge Runtime | Yes | Yes | Limited |
| Vercel Integration | Native | Native | Manual |

### B. Database Alternatives

| Database | Pros | Cons | Cost |
|----------|------|------|------|
| Vercel Postgres | Native integration, auto-scaling | Limited free tier | $10/mo |
| Supabase | Generous free tier, real-time | Separate hosting | Free-$25 |
| PlanetScale | Excellent scaling, branching | MySQL only | $29/mo |
| Neon | PostgreSQL, serverless | Newer product | Free-$19 |

### C. Monitoring Tools

- **Vercel Analytics**: Built-in, free
- **Sentry**: Error tracking, $26/mo
- **LogRocket**: Session replay, $99/mo
- **Datadog**: Full observability, $15/host/mo

### D. Cost Estimation

**Monthly costs (assuming 10k active events, 100k views)**:
- Vercel Pro: $20/month
- Vercel Postgres: $10/month (256MB)
- Domain: $12/year
- **Total: ~$30/month**

### E. Glossary

- **ISR**: Incremental Static Regeneration
- **RSC**: React Server Components
- **SSR**: Server-Side Rendering
- **CSR**: Client-Side Rendering
- **SSG**: Static Site Generation
- **CDN**: Content Delivery Network
- **ORM**: Object-Relational Mapping
- **CU**: Compute Unit (Vercel Postgres)

---

## Document Changelog

- **v1.0** (2025-11-17): Initial system design document

---

**Document Status**: Draft
**Review Required**: Architecture team review pending
**Next Steps**: Implementation planning, technology proof-of-concept
