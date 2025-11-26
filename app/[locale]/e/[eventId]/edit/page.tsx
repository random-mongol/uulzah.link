'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addDays, format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { DateTimeInput } from '@/components/ui/DateTimeInput'
import { Label } from '@/components/ui/Label'
import { t } from '@/lib/i18n/translations'
import { getLocalePath, type Locale } from '@/lib/i18n/locale'
import { generateFingerprint } from '@/lib/utils/fingerprint'

interface EventDate {
  id: number
  start_datetime: string
  end_datetime: string | null
  is_all_day: boolean
}

interface Event {
  id: string
  title: string
  description: string | null
  location?: string | null
  owner_name?: string | null
  dates: EventDate[]
}

interface DateTimeOption {
  id?: number
  date: string
  startTime: string
  endTime: string
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
  const [dateOptions, setDateOptions] = useState<DateTimeOption[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
      const formattedDates = (data.dates || []).map((date: EventDate) => ({
        id: date.id,
        date: format(new Date(date.start_datetime), 'yyyy-MM-dd'),
        startTime: format(new Date(date.start_datetime), 'HH:mm'),
        endTime: date.end_datetime ? format(new Date(date.end_datetime), 'HH:mm') : '',
      }))
      setDateOptions(
        formattedDates.length > 0
          ? formattedDates
          : [{
              date: format(new Date(), 'yyyy-MM-dd'),
              startTime: '19:00',
              endTime: '',
            }]
      )
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event')
      setLoading(false)
    }
  }

  const addDate = () => {
    const lastOption = dateOptions[dateOptions.length - 1]
    const baseDate = lastOption?.date ? new Date(lastOption.date) : new Date()
    const nextDate = format(addDays(baseDate, 1), 'yyyy-MM-dd')

    setDateOptions([
      ...dateOptions,
      {
        date: nextDate,
        startTime: lastOption?.startTime || '19:00',
        endTime: lastOption?.endTime || '',
      },
    ])
  }

  const updateDate = (index: number, field: keyof DateTimeOption, value: string) => {
    const newOptions = [...dateOptions]

    if (field === 'date' && value) {
      value = value.replace(/\//g, '-')
    }

    newOptions[index] = { ...newOptions[index], [field]: value }
    setDateOptions(newOptions)
  }

  const removeDate = (index: number) => {
    if (dateOptions.length > 1) {
      setDateOptions(dateOptions.filter((_, i) => i !== index))
    }
  }

  const validateTimeIncrement = (time: string): boolean => {
    if (!time) return true
    const [, minutes] = time.split(':')
    const min = parseInt(minutes, 10)
    return min % 15 === 0
  }

  const validateUniqueDateTimes = (): boolean => {
    const seen = new Set<string>()
    for (const option of dateOptions) {
      const key = `${option.date}-${option.startTime}-${option.endTime}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (dateOptions.length === 0) {
      setError(currentLocale === 'mn' ? 'Ядаж нэг огноо шаардлагатай' : 'At least one date is required')
      setSaving(false)
      return
    }

    if (!validateUniqueDateTimes()) {
      setError(currentLocale === 'mn' ? 'Огноо ба цаг давхцаж байна' : 'Duplicate dates and times detected')
      setSaving(false)
      return
    }

    const missingStartTime = dateOptions.some(opt => !opt.startTime)
    if (missingStartTime) {
      setError(currentLocale === 'mn' ? 'Эхлэх цагийг оруулна уу' : 'Please enter start times for all dates')
      setSaving(false)
      return
    }

    const invalidTime = dateOptions.some(opt =>
      !validateTimeIncrement(opt.startTime) || !validateTimeIncrement(opt.endTime)
    )
    if (invalidTime) {
      setError(currentLocale === 'mn' ? 'Цаг 15 минутын алхамаар байх ёстой (00, 15, 30, 45)' : 'Times must be in 15-minute increments (00, 15, 30, 45)')
      setSaving(false)
      return
    }

    try {
      const datesPayload = dateOptions.map(opt => {
        const startDatetime = new Date(`${opt.date}T${opt.startTime}:00`).toISOString()
        const endDatetime = opt.endTime ? new Date(`${opt.date}T${opt.endTime}:00`).toISOString() : null

        return {
          id: opt.id,
          startDatetime,
          endDatetime,
          isAllDay: false,
        }
      })

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
          dates: datesPayload,
          locale: currentLocale,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Redirect back to event page
      router.push(getLocalePath(`/e/${eventId}?edit=${editToken}`, currentLocale))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editToken) {
      setError(t('errors.notFound', currentLocale))
      return
    }

    const confirmed = window.confirm(t('edit.deleteConfirm', currentLocale))
    if (!confirmed) return

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'X-Edit-Token': editToken,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete event')
      }

      router.push(getLocalePath('/', currentLocale))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    } finally {
      setDeleting(false)
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

            <div>
              <Label required>
                {t('event.form.dates', currentLocale)}
              </Label>

              <div className="space-y-4 mt-2">
                {dateOptions.map((option, index) => (
                  <DateTimeInput
                    key={option.id ?? index}
                    index={index}
                    date={option.date}
                    startTime={option.startTime}
                    endTime={option.endTime}
                    onDateChange={(value) => updateDate(index, 'date', value)}
                    onStartTimeChange={(value) => updateDate(index, 'startTime', value)}
                    onEndTimeChange={(value) => updateDate(index, 'endTime', value)}
                    onRemove={() => removeDate(index)}
                    canRemove={dateOptions.length > 1}
                    locale={currentLocale}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDate}
                className="mt-4"
              >
                <Plus className="w-4 h-4" />
                {t('event.form.addDate', currentLocale)}
              </Button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {t('privacy.creator', currentLocale)}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(getLocalePath(`/e/${eventId}?edit=${editToken}`, currentLocale))}
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

          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-semibold text-red-800">{t('edit.delete', currentLocale)}</h2>
                <p className="text-sm text-red-700">{t('edit.deleteDescription', currentLocale)}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleting}
                  className="w-full sm:w-auto"
                >
                  {t('edit.delete', currentLocale)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
