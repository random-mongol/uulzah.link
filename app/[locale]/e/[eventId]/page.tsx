'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { GridCell } from '@/components/ui/GridCell'
import { t } from '@/lib/i18n/translations'
import { getLocalePath, type Locale } from '@/lib/i18n/locale'
import { generateFingerprint } from '@/lib/utils/fingerprint'

type CellStatus = '' | 'yes' | 'maybe'

interface EventDate {
  id: number
  start_datetime: string
  is_all_day: boolean
}

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  owner_name: string | null
  dates: EventDate[]
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

  const [event, setEvent] = useState<Event | null>(null)
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

      // Redirect to results page
      router.push(`/${currentLocale}/e/${eventId}/results`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert(t('event.share.copied', currentLocale))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">{t('common.loading', currentLocale)}</div>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!event) return null

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${currentLocale}/e/${event.id}`
  const editUrl = editToken ? `${shareUrl}?edit=${editToken}` : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
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
          {event.location && (
            <p className="text-gray-500 text-sm">📍 {event.location}</p>
          )}
          {event.owner_name && (
            <p className="text-gray-500 text-sm mt-1">
              {currentLocale === 'mn' ? 'Зохион байгуулагч:' : 'Organizer:'}{' '}
              {event.owner_name}
            </p>
          )}
          {editToken && !canEdit && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ {t('edit.restricted', currentLocale)}
              </p>
            </div>
          )}
        </div>

        {/* Response Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('response.form.title', currentLocale)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <Input
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
                <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${event.dates.length}, 1fr)`, minWidth: '100%' }}>
                  {event.dates.map((date) => (
                    <div key={date.id} className="text-center">
                      <div className="text-xs font-medium text-gray-600 mb-2">
                        {format(new Date(date.start_datetime), 'MM/dd')}
                        <br />
                        {format(new Date(date.start_datetime), 'EEE')}
                      </div>
                      <GridCell
                        status={availability[date.id] || ''}
                        onClick={() => cycleStatus(date.id)}
                        label={`${format(new Date(date.start_datetime), 'MM/dd')}`}
                      />
                    </div>
                  ))}
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
              label={t('response.form.comment', currentLocale)}
              placeholder={t('response.form.commentPlaceholder', currentLocale)}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting || !name}
              className="w-full"
              size="lg"
            >
              {submitting ? t('common.loading', currentLocale) : t('response.form.submit', currentLocale)}
            </Button>
          </form>

          {/* View Results Link */}
          <div className="mt-6 text-center">
            <a
              href={getLocalePath(`/e/${event.id}/results`, currentLocale)}
              className="text-primary hover:underline text-sm"
            >
              {t('results.title', currentLocale)} →
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
