'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = pathname?.startsWith('/en') ? 'en' : 'mn'

  const toggleLocale = () => {
    const newLocale = currentLocale === 'mn' ? 'en' : 'mn'
    const newPath = pathname?.replace(/^\/(mn|en)/, `/${newLocale}`) || `/${newLocale}`
    router.push(newPath)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${currentLocale}`} className="flex items-center">
            <span className="text-2xl font-bold text-primary">uulzah.link</span>
          </Link>

          <button
            onClick={toggleLocale}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-light rounded-md transition-colors"
          >
            {currentLocale === 'mn' ? 'EN' : 'МН'}
          </button>
        </div>
      </div>
    </header>
  )
}
