import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a locale
  const pathnameHasLocale = pathname.startsWith('/mn') || pathname.startsWith('/en')

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Skip for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Redirect to default locale (Mongolian)
  const locale = 'mn'
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon|.*\\..*).*)', '/'],
}
