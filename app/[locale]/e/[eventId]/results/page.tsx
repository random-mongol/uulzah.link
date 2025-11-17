'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { t, Locale } from '@/lib/i18n/translations'

interface EventDate {
  id: number
  start_datetime: string
  yes_count: number
  maybe_count: number
  no_count: number
}

interface Participant {
  id: number
  name: string
  responses: Record<number, 'yes' | 'no' | 'maybe'>
}

interface Results {
  event: {
    id: string
    title: string
    description: string | null
  }
  dates: EventDate[]
  participants: Participant[]
  totalParticipants: number
}

export default function ResultsPage({
  params,
}: {
  params: { locale: Locale; eventId: string }
}) {
  const locale = params.locale || 'mn'

  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadResults()
  }, [params.eventId])

  const loadResults = async () => {
    try {
      const response = await fetch(`/api/events/${params.eventId}/results`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setResults(data)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results')
      setLoading(false)
    }
  }

  const copyShareLink = () => {
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/e/${params.eventId}`
    navigator.clipboard.writeText(shareUrl)
    alert(t('event.share.copied', locale))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">{t('common.loading', locale)}</div>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || t('errors.notFound', locale)}
          </div>
        </div>
      </div>
    )
  }

  // Sort dates by yes_count (best options first)
  const sortedDates = [...results.dates].sort((a, b) => b.yes_count - a.yes_count)
  const bestDate = sortedDates[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {results.event.title}
          </h1>
          {results.event.description && (
            <p className="text-gray-600 mb-4">{results.event.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">{results.totalParticipants}</span>
              {t('results.summary', locale)}
            </div>

            <div className="flex gap-2 ml-auto">
              <Link href={`/${locale}/e/${params.eventId}`}>
                <Button variant="secondary" size="sm">
                  {t('results.addResponse', locale)}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={copyShareLink}>
                {t('results.copyLink', locale)}
              </Button>
            </div>
          </div>
        </div>

        {/* Best Options */}
        {results.totalParticipants > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('results.bestOptions', locale)}
            </h2>

            <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-primary">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🏆</span>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {format(new Date(bestDate.start_datetime), 'MMMM dd, yyyy (EEEE)')}
                  </div>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="text-green-600 font-semibold">
                      ✓ {bestDate.yes_count} {locale === 'mn' ? 'чөлөөтэй' : 'available'}
                    </span>
                    {bestDate.maybe_count > 0 && (
                      <span className="text-yellow-600">
                        ? {bestDate.maybe_count} {locale === 'mn' ? 'магадгүй' : 'maybe'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Detailed Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {locale === 'mn' ? 'Дэлгэрэнгүй мэдээлэл' : 'Detailed Results'}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-700">
                    {t('results.participants', locale)}
                  </th>
                  {results.dates.map((date) => (
                    <th key={date.id} className="text-center p-3 font-semibold text-gray-700 min-w-[80px]">
                      <div>{format(new Date(date.start_datetime), 'MM/dd')}</div>
                      <div className="text-xs font-normal text-gray-500">
                        {format(new Date(date.start_datetime), 'EEE')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.participants.map((participant) => (
                  <tr key={participant.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{participant.name}</td>
                    {results.dates.map((date) => {
                      const response = participant.responses[date.id]
                      return (
                        <td key={date.id} className="text-center p-3">
                          {response === 'yes' && <span className="text-green-600 text-lg">✓</span>}
                          {response === 'maybe' && <span className="text-yellow-600 text-lg">?</span>}
                          {response === 'no' && <span className="text-gray-300 text-lg">-</span>}
                          {!response && <span className="text-gray-200">-</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Summary Row */}
                {results.totalParticipants > 0 && (
                  <tr className="bg-gray-50 font-semibold">
                    <td className="p-3 text-gray-700">
                      {locale === 'mn' ? 'Нийт' : 'Total'}
                    </td>
                    {results.dates.map((date) => (
                      <td key={date.id} className="text-center p-3">
                        <div className="text-green-600">{date.yes_count}</div>
                        {date.maybe_count > 0 && (
                          <div className="text-xs text-yellow-600">+{date.maybe_count}</div>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {results.totalParticipants === 0 && (
            <div className="text-center py-12 text-gray-500">
              {locale === 'mn'
                ? 'Хариулт байхгүй байна. Эхлээд хариулт өгөөрэй!'
                : 'No responses yet. Be the first to respond!'}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
