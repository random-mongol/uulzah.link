'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { GridCell } from '@/components/ui/GridCell'
import { Spinner } from '@/components/ui/Spinner'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/lib/hooks/useToast'
import { t } from '@/lib/i18n/translations'
import { getLocalePath, type Locale } from '@/lib/i18n/locale'
import { generateFingerprint } from '@/lib/utils/fingerprint'

type CellStatus = '' | 'yes' | 'maybe'

interface EventDate {
  id: number
  start_datetime: string
  end_datetime: string | null
  is_all_day: boolean
  yes_count?: number
  maybe_count?: number
  no_count?: number
}

interface Participant {
  id: number
  name: string
  responses: Record<number, 'yes' | 'no' | 'maybe'>
}

interface Event {
  id: string
  title: string
  description: string | null
  dates: EventDate[]
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

export default function EventPage({
  params,
}: {
  params: Promise<{ locale: Locale; eventId: string }>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale, eventId } = use(params)
  const currentLocale = locale || 'mn'
  const editToken = searchParams?.get('edit')
  const { toasts, showToast, removeToast } = useToast()

  const [event, setEvent] = useState<Event | null>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [availability, setAvailability] = useState<Record<number, CellStatus>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(!!editToken)
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    loadEvent()
    loadResults()
    if (editToken) {
      verifyEditAccess()
    }
  }, [eventId, editToken])

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setEvent(data)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event')
      setLoading(false)
    }
  }

  const loadResults = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/results`)
      const data = await response.json()

      if (response.ok) {
        setResults(data)
      }
    } catch (err) {
      console.error('Failed to load results:', err)
      // Don't set error, results are optional
    }
  }

  const verifyEditAccess = async () => {
    if (!editToken) return

    try {
      const fingerprint = generateFingerprint()
      const response = await fetch(`/api/events/${eventId}/verify-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editToken, fingerprint }),
      })

      const data = await response.json()
      setCanEdit(data.canEdit || false)
    } catch (err) {
      console.error('Failed to verify edit access:', err)
      setCanEdit(false)
    }
  }

  const cycleStatus = (dateId: number) => {
    const current = availability[dateId] || ''
    const next = current === '' ? 'yes' : current === 'yes' ? 'maybe' : ''
    setAvailability({ ...availability, [dateId]: next })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const responses = Object.entries(availability)
        .filter(([_, status]) => status !== '')
        .map(([dateId, status]) => ({
          eventDateId: parseInt(dateId),
          status,
        }))

      const response = await fetch(`/api/events/${eventId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantName: name,
          comment,
          responses,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Reload results to show updated data
      await loadResults()

      // Clear form
      setName('')
      setComment('')
      setAvailability({})

      // Show success message
      showToast(currentLocale === 'mn' ? 'Хариулт амжилттай илгээгдлээ!' : 'Response submitted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    showToast(t('event.share.copied', currentLocale))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" text={t('common.loading', currentLocale)} />
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 text-red-700 flex items-start gap-3 shadow-sm animate-slide-up">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-lg mb-1">{t('common.error', currentLocale)}</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!event) return null

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/e/${event.id}`
  const editUrl = editToken ? `${shareUrl}?edit=${editToken}` : ''

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Share Dialog */}
        {showShareDialog && editToken && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-green-900 mb-4">
              {t('event.share.title', currentLocale)}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1">
                  {t('event.share.shareLink', currentLocale)}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                  />
                  <Button size="sm" onClick={() => copyLink(shareUrl)}>
                    {t('event.share.copy', currentLocale)}
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1">
                  {t('event.share.editLink', currentLocale)}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                  />
                  <Button size="sm" onClick={() => copyLink(editUrl)}>
                    {t('event.share.copy', currentLocale)}
                  </Button>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {t('event.share.editWarning', currentLocale)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareDialog(false)}
              className="mt-4"
            >
              {locale === 'mn' ? 'Хаах' : 'Close'}
            </Button>
          </div>
        )}

        {/* Event Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {event.title}
            </h1>
            {editToken && canEdit && (
              <Link href={getLocalePath(`/e/${eventId}/edit?token=${editToken}`, currentLocale)}>
                <Button variant="secondary" size="sm">
                  {t('edit.button', currentLocale)}
                </Button>
              </Link>
            )}
          </div>
          {event.description && (
            <p className="text-gray-600 mb-2">{event.description}</p>
          )}
          {editToken && !canEdit && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ {t('edit.restricted', currentLocale)}
              </p>
            </div>
          )}
        </div>

        {/* Results Section - Show if there are participants */}
        {results && results.totalParticipants > 0 && (
          <>
            {/* Best Option Card */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('results.bestOptions', currentLocale)}
              </h2>
              {(() => {
                const sortedDates = [...results.dates].sort((a, b) => (b.yes_count || 0) - (a.yes_count || 0))
                const bestDate = sortedDates[0]
                return (
                  <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-primary rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">🏆</span>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">
                          {format(new Date(bestDate.start_datetime), 'MMMM dd, yyyy (EEEE)')}
                          {!bestDate.is_all_day && (
                            <>
                              {' at '}
                              {format(new Date(bestDate.start_datetime), 'HH:mm')}
                              {bestDate.end_datetime && ` - ${format(new Date(bestDate.end_datetime), 'HH:mm')}`}
                            </>
                          )}
                        </div>
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="text-green-600 font-semibold">
                            ✓ {bestDate.yes_count} {currentLocale === 'mn' ? 'чөлөөтэй' : 'available'}
                          </span>
                          {(bestDate.maybe_count || 0) > 0 && (
                            <span className="text-yellow-600">
                              ? {bestDate.maybe_count} {currentLocale === 'mn' ? 'магадгүй' : 'maybe'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Detailed Results Table */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentLocale === 'mn' ? 'Дэлгэрэнгүй мэдээлэл' : 'Current Responses'}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold text-gray-700">
                        {t('results.participants', currentLocale)}
                      </th>
                      {results.dates.map((date) => (
                        <th key={date.id} className="text-center p-3 font-semibold text-gray-700 min-w-[80px]">
                          <div>{format(new Date(date.start_datetime), 'MM/dd')}</div>
                          <div className="text-xs font-normal text-gray-500">
                            {format(new Date(date.start_datetime), 'EEE')}
                          </div>
                          {!date.is_all_day && (
                            <div className="text-xs font-normal text-gray-500">
                              {format(new Date(date.start_datetime), 'HH:mm')}
                              {date.end_datetime && `-${format(new Date(date.end_datetime), 'HH:mm')}`}
                            </div>
                          )}
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
                    <tr className="bg-gray-50 font-semibold">
                      <td className="p-3 text-gray-700">
                        {currentLocale === 'mn' ? 'Нийт' : 'Total'}
                      </td>
                      {results.dates.map((date) => (
                        <td key={date.id} className="text-center p-3">
                          <div className="text-green-600">{date.yes_count || 0}</div>
                          {(date.maybe_count || 0) > 0 && (
                            <div className="text-xs text-yellow-600">+{date.maybe_count}</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Response Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {results && results.totalParticipants > 0
              ? (currentLocale === 'mn' ? 'Таны боломж нэмэх' : 'Add Your Availability')
              : t('response.form.title', currentLocale)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <Input
              name="name"
              label={t('response.form.name', currentLocale)}
              placeholder={t('response.form.namePlaceholder', currentLocale)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Availability Grid */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('response.form.availability', currentLocale)}
              </label>

              <div className="overflow-x-auto">
                <div className="flex gap-2 flex-wrap">
                  {event.dates.map((date) => {
                    const dateLabel = format(new Date(date.start_datetime), 'MM/dd')
                    const dayLabel = format(new Date(date.start_datetime), 'EEE')
                    const startTime = format(new Date(date.start_datetime), 'HH:mm')
                    const endTime = date.end_datetime ? format(new Date(date.end_datetime), 'HH:mm') : ''
                    const timeLabel = date.is_all_day
                      ? t('common.allDay', currentLocale)
                      : endTime ? `${startTime} - ${endTime}` : startTime

                    return (
                      <GridCell
                        key={date.id}
                        dateId={date.id}
                        status={availability[date.id] || ''}
                        onClick={() => cycleStatus(date.id)}
                        label={`${dateLabel} ${dayLabel} ${timeLabel}`}
                        dateLabel={dateLabel}
                        dayLabel={dayLabel}
                        timeLabel={timeLabel}
                        locale={currentLocale}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 text-sm text-gray-600">
                {t('response.form.legend', currentLocale)}{' '}
                <span className="inline-flex items-center gap-4 ml-2">
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> {t('response.form.yes', currentLocale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-600">?</span> {t('response.form.maybe', currentLocale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">□</span> {t('response.form.no', currentLocale)}
                  </span>
                </span>
              </div>
            </div>

            {/* Comment */}
            <Textarea
              name="comment"
              label={t('response.form.comment', currentLocale)}
              placeholder={t('response.form.commentPlaceholder', currentLocale)}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start gap-3 animate-slide-up">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting || !name}
              className="w-full"
              size="lg"
            >
              {submitting ? t('common.loading', currentLocale) : t('response.form.submit', currentLocale)}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
