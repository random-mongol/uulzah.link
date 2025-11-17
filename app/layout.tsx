import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LocaleHandler } from '@/components/LocaleHandler'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'uulzah.link - Үйл явдлын товыг үүсгэх',
  description: 'Хурдан бөгөөд энгийн үйл явдлын товыг үүсгэн найз нөхөд болон хамт олонтойгоо хуваалцаарай',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <LocaleHandler />
        {children}
      </body>
    </html>
  )
}
