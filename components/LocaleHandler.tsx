'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getLocaleFromPath } from '@/lib/i18n/locale'

/**
 * Client component that ensures the HTML lang attribute matches the current locale
 */
export function LocaleHandler() {
  const pathname = usePathname()

  useEffect(() => {
    const locale = getLocaleFromPath(pathname || '/')

    // Update the html lang attribute to match the current locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [pathname])

  return null
}
