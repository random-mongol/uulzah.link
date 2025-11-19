'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { t } from '@/lib/i18n/translations'
import { type Locale } from '@/lib/i18n/locale'
import { generateFingerprint } from '@/lib/utils/fingerprint'

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  owner_name: string | null
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ locale: Locale; eventId: string }>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale, eventId } = use(params)
  const currentLocale = locale || 'mn'
  const editToken = searchParams?.get('token')

  const [event, setEvent] = useState<Event | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [ownerName, setOwnerName] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [canEdit, setCanEdit] = useState(false)
  const [accessChecked, setAccessChecked] = useState(false)

  useEffect(() => {
    if (!editToken) {
      setError(t('errors.notFound', currentLocale))
      setLoading(false)
      return
    }

    checkAccessAndLoadEvent()
  }, [eventId, editToken])

  const checkAccessAndLoadEvent = async () => {
    try {
      const fingerprint = generateFingerprint()

      // Verify access
      const verifyResponse = await fetch(`/api/events/${eventId}/verify-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editToken, fingerprint }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.canEdit) {
        setCanEdit(false)
        setAccessChecked(true)
        setError(t('edit.restrictedDevice', currentLocale))
        setLoading(false)
        return
      }

      setCanEdit(true)
      setAccessChecked(true)

      // Load event
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setEvent(data)
      setTitle(data.title || '')
      setDescription(data.description || '')
      setLocation(data.location || '')
      setOwnerName(data.owner_name || '')
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Edit-Token': editToken || '',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          owner_name: ownerName,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Redirect back to event page
      router.push(`/${currentLocale}/e/${eventId}?edit=${editToken}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">{t('common.loading', currentLocale)}</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!canEdit || !accessChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">
              {t('edit.restrictedDevice', currentLocale)}
            </h2>
            <p className="text-red-700 mb-4">
              {t('edit.restricted', currentLocale)}
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {t('edit.title', currentLocale)}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('event.form.title', currentLocale)}
              placeholder={t('event.form.titlePlaceholder', currentLocale)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
            />

            <Textarea
              label={t('event.form.description', currentLocale)}
              placeholder={t('event.form.descriptionPlaceholder', currentLocale)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />

            <Input
              label={t('event.form.location', currentLocale)}
              placeholder={t('event.form.locationPlaceholder', currentLocale)}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={500}
            />

            <Input
              label={t('event.form.ownerName', currentLocale)}
              placeholder={t('event.form.ownerNamePlaceholder', currentLocale)}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              maxLength={100}
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/${currentLocale}/e/${eventId}?edit=${editToken}`)}
                className="flex-1"
              >
                {t('event.form.cancel', currentLocale)}
              </Button>
              <Button
                type="submit"
                disabled={saving || !title}
                className="flex-1"
              >
                {saving ? t('common.loading', currentLocale) : t('edit.save', currentLocale)}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
