'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLocaleFromPath, getLocalePath, type Locale } from '@/lib/i18n/locale'
import { t } from '@/lib/i18n/translations'

type FooterProps = {
  locale?: Locale
}

export function Footer({ locale }: FooterProps) {
  const pathname = usePathname()
  const currentLocale = locale || getLocaleFromPath(pathname || '/')
  const homePath = getLocalePath('/', currentLocale)
  const privacyPath = getLocalePath('/privacy', currentLocale)

  return (
    <footer className="relative mt-auto border-t border-gray-200 bg-gradient-to-br from-gray-50 via-white to-primary-light/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-r from-primary/10 via-primary-light/20 to-secondary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,102,204,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,140,66,0.08),transparent_35%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <Image
              src="/logo.jpg"
              alt={t('footer.logoAlt', currentLocale)}
              width={48}
              height={48}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="space-y-1">
            <Link
              href="https://huuli.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-gray-900 hover:text-primary transition-colors"
            >
              Made with <span className="text-primary">❤️</span> by <span className="text-primary">huuli.tech</span>
            </Link>
            <p className="text-sm text-gray-600">{t('footer.madeWith', currentLocale)}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2 text-left md:text-right">
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 shadow-sm">
              {t('footer.copy', currentLocale)}
            </span>
            <a
              href="https://chouseisan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 ring-1 ring-gray-200 shadow-sm hover:text-primary hover:ring-primary/40 transition-all"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden />
              {t('footer.inspired', currentLocale)}
            </a>
            <Link
              href={privacyPath}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 shadow-sm hover:text-primary hover:ring-primary/40 transition-all"
            >
              {t('footer.privacy', currentLocale)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
