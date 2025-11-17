import { NextRequest, NextResponse } from 'next/server'

const defaultLocale = 'mn'
const locales = ['mn', 'en']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Check if pathname starts with a locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale) {
    // If it's the default locale in the URL, redirect to remove it
    if (pathnameLocale === defaultLocale) {
      const newPathname = pathname.replace(`/${defaultLocale}`, '') || '/'
      request.nextUrl.pathname = newPathname
      return NextResponse.redirect(request.nextUrl)
    }
    // For non-default locales (e.g., /en), just continue
    return NextResponse.next()
  }

  // For paths without locale prefix, rewrite to default locale (mn) internally
  // This keeps the URL clean (no /mn) but Next.js sees it as /mn/...
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon|.*\\..*).*)', '/'],
}
