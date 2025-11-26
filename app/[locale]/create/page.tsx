'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays, nextFriday, nextSaturday, parse } from 'date-fns'
import { Plus } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { DateTimeInput } from '@/components/ui/DateTimeInput'
import { Label } from '@/components/ui/Label'
import { VoiceRecorder } from '@/components/VoiceRecorder'
import { t, Locale } from '@/lib/i18n/translations'
import { generateFingerprint } from '@/lib/utils/fingerprint'
import type { VoiceMeetingData } from '@/lib/types/voice'

interface DateTimeOption {
  date: string // yyyy-MM-dd
  startTime: string // HH:mm
  endTime: string // HH:mm or empty
}

// Helper to get next Friday at 19:00
function getDefaultDates(): DateTimeOption[] {
  const today = new Date()
  const friday = nextFriday(today)
  const saturday = nextSaturday(today)

  return [
    {
      date: format(friday, 'yyyy-MM-dd'),
      startTime: '19:00',
      endTime: '',
    },
    {
      date: format(saturday, 'yyyy-MM-dd'),
      startTime: '19:00',
      endTime: '',
    },
  ]
}

export default function CreateEventPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const router = useRouter()
  const { locale } = use(params)
  const currentLocale = locale || 'mn'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dateOptions, setDateOptions] = useState<DateTimeOption[]>(getDefaultDates())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [voiceSuccess, setVoiceSuccess] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [explanation, setExplanation] = useState('')

  const addDate = () => {
    // Add next day with the same time as the last option
    const lastOption = dateOptions[dateOptions.length - 1]
    const lastDate = new Date(lastOption.date)
    const nextDay = addDays(lastDate, 1)

    setDateOptions([
      ...dateOptions,
      {
        date: format(nextDay, 'yyyy-MM-dd'),
        startTime: lastOption.startTime,
        endTime: lastOption.endTime,
      },
    ])
  }

  const updateDate = (index: number, field: keyof DateTimeOption, value: string) => {
    const newOptions = [...dateOptions]

    // Normalize date format: accept yyyy/mm/dd or yyyy-mm-dd
    if (field === 'date' && value) {
      value = value.replace(/\//g, '-')
    }

    newOptions[index][field] = value
    setDateOptions(newOptions)
  }

  const removeDate = (index: number) => {
    if (dateOptions.length > 1) {
      setDateOptions(dateOptions.filter((_, i) => i !== index))
    }
  }

  // Auto-populate end time with start time + 2 hours
  const handleEndTimeFocus = (index: number) => {
    const option = dateOptions[index]
    if (!option.endTime && option.startTime) {
      // Parse start time and add 2 hours
      const [hours, minutes] = option.startTime.split(':').map(Number)
      const endHours = (hours + 2) % 24
      const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      updateDate(index, 'endTime', endTime)
    }
  }

  // Validate time is in 15-minute increments
  const validateTimeIncrement = (time: string): boolean => {
    if (!time) return true // Empty is ok
    const [_, minutes] = time.split(':')
    const min = parseInt(minutes, 10)
    return min % 15 === 0
  }

  // Validate unique date/time combinations
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

  // Handle voice recording result
  const handleVoiceResult = (data: VoiceMeetingData, text: string) => {
    // Clear any previous errors
    setError('')
    setTranscription(text)
    setExplanation(data.explanation || '')

    // Fill in title
    if (data.title) {
      setTitle(data.title)
    }

    // Fill in description
    if (data.description) {
      setDescription(data.description)
    }

    // Fill in dates
    if (data.possibleDates && data.possibleDates.length > 0) {
      const newDateOptions: DateTimeOption[] = []

      for (const voiceDate of data.possibleDates) {
        if (voiceDate.isoDate) {
          // Parse time range
          let startTime = '19:00' // default
          let endTime = ''

          if (voiceDate.timeRange) {
            const timeRangeMatch = voiceDate.timeRange.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/)
            if (timeRangeMatch) {
              startTime = timeRangeMatch[1]
              endTime = timeRangeMatch[2]
            } else {
              // Single time
              const singleTimeMatch = voiceDate.timeRange.match(/(\d{1,2}:\d{2})/)
              if (singleTimeMatch) {
                startTime = singleTimeMatch[1]
              }
            }
          }

          newDateOptions.push({
            date: voiceDate.isoDate,
            startTime,
            endTime,
          })
        }
      }

      if (newDateOptions.length > 0) {
        setDateOptions(newDateOptions)
      }
    }

    // Show success message
    setVoiceSuccess(true)
    setTimeout(() => setVoiceSuccess(false), 5000) // Hide after 5 seconds
  }

  // Handle voice recording error
  const handleVoiceError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate unique date/times
    if (!validateUniqueDateTimes()) {
      setError(currentLocale === 'mn' ? 'Огноо ба цаг давхцаж байна' : 'Duplicate dates and times detected')
      setLoading(false)
      return
    }

    // Validate all start times are filled
    const missingStartTime = dateOptions.some(opt => !opt.startTime)
    if (missingStartTime) {
      setError(currentLocale === 'mn' ? 'Эхлэх цагийг оруулна уу' : 'Please enter start times for all dates')
      setLoading(false)
      return
    }

    // Validate 15-minute increments
    const invalidTime = dateOptions.some(opt =>
      !validateTimeIncrement(opt.startTime) || !validateTimeIncrement(opt.endTime)
    )
    if (invalidTime) {
      setError(currentLocale === 'mn' ? 'Цаг 15 минутын алхамаар байх ёстой (00, 15, 30, 45)' : 'Times must be in 15-minute increments (00, 15, 30, 45)')
      setLoading(false)
      return
    }

    try {
      const fingerprint = generateFingerprint()

      // Convert date/time options to proper datetime format
      const dates = dateOptions.map(opt => {
        const startDatetime = new Date(`${opt.date}T${opt.startTime}:00`).toISOString()
        const endDatetime = opt.endTime ? new Date(`${opt.date}T${opt.endTime}:00`).toISOString() : null

        return {
          startDatetime,
          endDatetime,
          isAllDay: false,
        }
      })

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          dates,
          fingerprint,
          locale: currentLocale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event')
      }

      // Redirect to event page (without locale prefix as per requirements)
      router.push(`/e/${data.eventId}?edit=${data.editToken}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {t('home.hero.cta', currentLocale)}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Voice Input */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-light to-blue-50 rounded-lg border-2 border-primary-light">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">🎤</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {currentLocale === 'mn' ? 'Дуугаар оруулах' : 'Voice Input'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentLocale === 'mn'
                      ? 'Уулзалтын гарчиг, тайлбар болон боломжит огноонуудыг дуугаар оруулна уу'
                      : 'Speak to fill in the meeting title, description, and possible dates'}
                  </p>
                </div>
              </div>
              <VoiceRecorder
                locale={currentLocale}
                onResult={handleVoiceResult}
                onError={handleVoiceError}
              />
            </div>

            {voiceSuccess && (
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm flex items-start gap-3 animate-slide-up">
                  <span className="text-lg">✅</span>
                  <span>{t('event.form.voiceSuccess', currentLocale)}</span>
                </div>

                {/* Transcription & Analysis */}
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      {currentLocale === 'mn' ? 'Таны хэлсэн үг:' : 'Transcription:'}
                    </h4>
                    <p className="text-gray-600 text-sm italic">"{transcription}"</p>
                  </div>
                  
                  {explanation && (
                    <div className="pt-3 border-t">
                      <h4 className="text-sm font-semibold text-blue-700 mb-1">
                        {currentLocale === 'mn' ? 'AI Тайлбар:' : 'AI Analysis:'}
                      </h4>
                      <p className="text-blue-800 text-sm">{explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <Input
              name="title"
              label={t('event.form.title', currentLocale)}
              placeholder={t('event.form.titlePlaceholder', currentLocale)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
            />

            {/* Description */}
            <Textarea
              name="description"
              label={t('event.form.description', currentLocale)}
              placeholder={t('event.form.descriptionPlaceholder', currentLocale)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />

            {/* Date/Time Options */}
            <div>
              <Label required>
                {t('event.form.dates', currentLocale)}
              </Label>

              <div className="space-y-4">
                {dateOptions.map((option, index) => (
                  <DateTimeInput
                    key={index}
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

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start gap-3 animate-slide-up">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                loading={loading}
                disabled={loading || !title || dateOptions.length === 0}
                className="flex-1"
              >
                {loading ? t('common.loading', currentLocale) : t('event.form.submit', currentLocale)}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
