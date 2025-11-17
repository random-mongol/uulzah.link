'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { t, Locale } from '@/lib/i18n/translations'
import { generateFingerprint } from '@/lib/utils/fingerprint'

export default function CreateEventPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const router = useRouter()
  const { locale } = use(params)
  const currentLocale = locale || 'mn'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [dates, setDates] = useState<string[]>([format(new Date(), 'yyyy-MM-dd')])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addDate = () => {
    setDates([...dates, format(new Date(), 'yyyy-MM-dd')])
  }

  const updateDate = (index: number, value: string) => {
    const newDates = [...dates]
    newDates[index] = value
    setDates(newDates)
  }

  const removeDate = (index: number) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const fingerprint = generateFingerprint()

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          ownerName,
          dates: dates.map(d => ({ startDatetime: new Date(d).toISOString(), isAllDay: true })),
          fingerprint,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event')
      }

      // Redirect to event page
      router.push(`/${currentLocale}/e/${data.eventId}?edit=${data.editToken}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {t('home.hero.cta', currentLocale)}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label={t('event.form.title', currentLocale)}
              placeholder={t('event.form.titlePlaceholder', currentLocale)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
            />

            {/* Description */}
            <Textarea
              label={t('event.form.description', currentLocale)}
              placeholder={t('event.form.descriptionPlaceholder', currentLocale)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />

            {/* Location */}
            <Input
              label={t('event.form.location', currentLocale)}
              placeholder={t('event.form.locationPlaceholder', currentLocale)}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={500}
            />

            {/* Owner Name */}
            <Input
              label={t('event.form.ownerName', currentLocale)}
              placeholder={t('event.form.ownerNamePlaceholder', currentLocale)}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              maxLength={100}
            />

            {/* Dates */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('event.form.dates', currentLocale)} <span className="text-red-500">*</span>
              </label>

              <div className="space-y-2">
                {dates.map((date, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => updateDate(index, e.target.value)}
                      required
                      className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-light"
                    />
                    {dates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDate(index)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDate}
                className="mt-3"
              >
                + {t('event.form.addDate', currentLocale)}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1"
              >
                {t('event.form.cancel', currentLocale)}
              </Button>
              <Button
                type="submit"
                disabled={loading || !title || dates.length === 0}
                className="flex-1"
              >
                {loading ? t('common.loading', currentLocale) : t('event.form.submit', currentLocale)}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
