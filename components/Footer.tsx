'use client'

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 px-4 mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p className="text-sm text-gray-600">
          &copy; 2025 uulzah.link
        </p>
        <p className="text-xs text-gray-500">
          Inspired by{' '}
          <a
            href="https://chouseisan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark underline transition-colors"
          >
            chouseisan.com
          </a>
        </p>
        <p className="text-xs text-gray-500">
          Made with 🧡 by{' '}
          <a
            href="http://huuli.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark underline transition-colors"
          >
            huuli.tech
          </a>
          {' '}team
        </p>
      </div>
    </footer>
  )
}
