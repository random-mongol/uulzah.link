# uulzah.link

A fast, simple scheduling and polling application for finding the best time for meetings and events. Similar to chouseisan.com but with Mongolian language support.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

Visit http://localhost:3000

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Postgres, Drizzle ORM
- **Infrastructure**: Vercel, Vercel KV (Redis)
- **Language**: Mongolian + English support

## Key Features

- ✅ Create scheduling polls with multiple date/time options
- ✅ No login required for basic functionality
- ✅ Share URLs for participants to indicate availability
- ✅ Real-time response tracking
- ✅ Visual availability grid
- ✅ Mongolian language support
- ✅ Mobile-responsive design
- ✅ Fast performance with edge caching

## Documentation

📖 **[Complete System Design Document](./SYSTEM_DESIGN.md)** - Comprehensive technical documentation including:
- Detailed architecture
- Complete database schema
- API design and endpoints
- Performance and scalability considerations
- Deployment strategy
- Security best practices

## Project Structure

```
uulzah-link/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── components/        # Shared components
├── db/                    # Database schema and migrations
│   ├── schema.ts          # Drizzle schema
│   └── migrations/        # SQL migrations
├── lib/                   # Utility functions
│   ├── validations.ts     # Zod schemas
│   ├── db.ts             # Database client
│   └── rate-limit.ts     # Rate limiting
├── messages/              # i18n translations
│   ├── mn.json           # Mongolian
│   └── en.json           # English
└── public/               # Static assets
```

## Development

```bash
# Run tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format

# Database commands
pnpm db:generate    # Generate migrations
pnpm db:migrate     # Run migrations
pnpm db:push        # Push schema to DB
pnpm db:studio      # Open Drizzle Studio
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

See [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md#deployment-strategy) for detailed deployment instructions.

## Environment Variables

```env
# Database (Vercel Postgres)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=

# Redis (Vercel KV)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Application
NEXT_PUBLIC_APP_URL=https://uulzah.link
NEXT_PUBLIC_DEFAULT_LOCALE=mn
```

## Contributing

Contributions are welcome! Please read the [system design document](./SYSTEM_DESIGN.md) to understand the architecture before contributing.

## License

MIT

## Links

- **Live Demo**: https://uulzah.link
- **Documentation**: [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)
- **Issues**: https://github.com/yourusername/uulzah-link/issues

---

Built with ❤️ for the Mongolian community
