export const defaultLocale = 'mn' as const
export const locales = ['mn', 'en'] as const
export type Locale = (typeof locales)[number]

/**
 * Generate a locale-aware URL path
 * - For default locale (mn): returns path without locale prefix
 * - For other locales (en): returns path with locale prefix
 */
export function getLocalePath(path: string, locale: Locale): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // For default locale, return path without locale prefix
  if (locale === defaultLocale) {
    return normalizedPath
  }

  // For other locales, add locale prefix
  return `/${locale}${normalizedPath}`
}

/**
 * Extract locale from pathname
 * Returns the locale if found in path, otherwise returns default locale
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return defaultLocale
}
