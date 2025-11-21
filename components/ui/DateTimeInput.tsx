import { cn } from '@/lib/utils/cn'
import { Calendar, Clock, X } from 'lucide-react'
import { t, type Locale } from '@/lib/i18n/translations'

interface DateTimeInputProps {
  date: string
  startTime: string
  endTime: string
  onDateChange: (value: string) => void
  onStartTimeChange: (value: string) => void
  onEndTimeChange: (value: string) => void
  onRemove?: () => void
  canRemove?: boolean
  locale: Locale
  index?: number
}

export function DateTimeInput({
  date,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onRemove,
  canRemove,
  locale,
  index,
}: DateTimeInputProps) {
  return (
    <div
      className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
      data-testid={index !== undefined ? `date-time-input-${index}` : undefined}
    >
      {/* Remove button - only show on hover if removable */}
      {canRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 flex items-center justify-center shadow-md"
          aria-label={locale === 'mn' ? 'Устгах' : 'Remove'}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date Input */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {locale === 'mn' ? 'Огноо' : 'Date'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              onBlur={(e) => {
                const normalized = e.target.value.replace(/\//g, '-')
                if (normalized !== e.target.value) {
                  onDateChange(normalized)
                }
              }}
              required
              placeholder="YYYY-MM-DD"
              pattern="\d{4}[-/]\d{2}[-/]\d{2}"
              className={cn(
                'w-full pl-10 pr-3 py-2.5 text-sm',
                'border border-gray-300 rounded-lg',
                'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                'transition-all duration-200'
              )}
              title={
                locale === 'mn'
                  ? 'Огноог YYYY-MM-DD эсвэл YYYY/MM/DD форматаар оруулна уу'
                  : 'Enter date as YYYY-MM-DD or YYYY/MM/DD'
              }
            />
          </div>
        </div>

        {/* Start Time Input */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {locale === 'mn' ? 'Эхлэх цаг' : 'Start Time'}
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              required
              placeholder="HH:MM"
              pattern="([01]\d|2[0-3]):[0-5]\d"
              className={cn(
                'w-full pl-10 pr-3 py-2.5 text-sm',
                'border border-gray-300 rounded-lg',
                'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                'transition-all duration-200'
              )}
              title={
                locale === 'mn'
                  ? 'Цагийг HH:MM форматаар оруулна уу (15 минутын алхамаар)'
                  : 'Enter time as HH:MM (15-minute increments)'
              }
            />
          </div>
        </div>

        {/* End Time Input */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {locale === 'mn' ? 'Дуусах цаг' : 'End Time'}{' '}
            <span className="text-gray-400 text-xs">{t('common.optional', locale)}</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              onFocus={() => {
                if (!endTime && startTime) {
                  const [hours, minutes] = startTime.split(':').map(Number)
                  const endHours = (hours + 2) % 24
                  const calculatedEndTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
                  onEndTimeChange(calculatedEndTime)
                }
              }}
              placeholder="HH:MM"
              pattern="([01]\d|2[0-3]):[0-5]\d"
              className={cn(
                'w-full pl-10 pr-3 py-2.5 text-sm',
                'border border-gray-300 rounded-lg',
                'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                'transition-all duration-200'
              )}
              title={
                locale === 'mn'
                  ? 'Дуусах цаг (автоматаар эхлэх цаг + 2 цаг)'
                  : 'End time (auto-fills with start time + 2 hours)'
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
