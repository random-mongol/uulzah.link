import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
    <html lang="mn" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
