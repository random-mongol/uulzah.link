import { useEffect, useMemo, useRef, useState } from 'react'
import { addDays, addMonths, format, isSameDay, isSameMonth, isValid, parse, startOfMonth, startOfWeek } from 'date-fns'
import { enUS, mn } from 'date-fns/locale'
import { Calendar, Clock, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { t, type Locale } from '@/lib/i18n/translations'

const WEEK_STARTS_ON_MONDAY = 1

function parseDateValue(value: string) {
  if (!value) return null
  const normalized = value.replace(/\//g, '-')
  const parsed = parse(normalized, 'yyyy-MM-dd', new Date())
  return isValid(parsed) ? parsed : null
}

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
  const [showCalendar, setShowCalendar] = useState(false)
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false)
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => parseDateValue(date) ?? new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  const dateLocale = locale === 'mn' ? mn : enUS
  const selectedDate = parseDateValue(date)
  const weekdayLabel = selectedDate ? format(selectedDate, 'EEEE', { locale: dateLocale }) : ''

  const timeOptions = useMemo(() => {
    const options: string[] = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        options.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
      }
    }
    return options
  }, [])

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON_MONDAY })
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EE', { locale: dateLocale }))
  }, [dateLocale])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON_MONDAY })
    return Array.from({ length: 42 }, (_, i) => addDays(startDate, i))
  }, [currentMonth])

  useEffect(() => {
    const parsed = parseDateValue(date)
    if (parsed) {
      setCurrentMonth(parsed)
    }
  }, [date])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
        setShowStartTimeDropdown(false)
        setShowEndTimeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={containerRef}
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-gray-600">
              {locale === 'mn' ? 'Огноо' : 'Date'}
            </label>
            {weekdayLabel && <span className="text-[11px] font-semibold text-primary">{weekdayLabel}</span>}
          </div>
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
                'w-full pl-10 pr-12 py-2.5 text-sm',
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
            <button
              type="button"
              onClick={() => {
                setShowCalendar(prev => !prev)
                setShowStartTimeDropdown(false)
                setShowEndTimeDropdown(false)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-primary transition-colors"
              aria-label={locale === 'mn' ? 'Календар нээх' : 'Open calendar'}
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showCalendar && (
              <div className="absolute z-20 mt-2 w-full sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
                    aria-label={locale === 'mn' ? 'Өмнөх сар' : 'Previous month'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-sm font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
                    aria-label={locale === 'mn' ? 'Дараагийн сар' : 'Next month'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-[11px] text-gray-500 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(dayDate => {
                    const formattedDate = format(dayDate, 'yyyy-MM-dd')
                    const isSelected = selectedDate ? isSameDay(dayDate, selectedDate) : false
                    const isCurrentMonth = isSameMonth(dayDate, currentMonth)
                    return (
                      <button
                        key={formattedDate}
                        type="button"
                        onClick={() => {
                          onDateChange(formattedDate)
                          setShowCalendar(false)
                        }}
                        className={cn(
                          'h-9 rounded-md text-sm transition-colors',
                          isSelected
                            ? 'bg-primary text-white font-semibold'
                            : isCurrentMonth
                              ? 'text-gray-900 hover:bg-primary-light'
                              : 'text-gray-400 hover:bg-gray-100'
                        )}
                      >
                        {format(dayDate, 'd')}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
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
                'w-full pl-10 pr-12 py-2.5 text-sm',
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
            <button
              type="button"
              onClick={() => {
                setShowStartTimeDropdown(prev => !prev)
                setShowCalendar(false)
                setShowEndTimeDropdown(false)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-primary transition-colors"
              aria-label={locale === 'mn' ? 'Цаг сонгох' : 'Open time options'}
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showStartTimeDropdown && (
              <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {timeOptions.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      onStartTimeChange(time)
                      setShowStartTimeDropdown(false)
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-primary-light transition-colors',
                      startTime === time ? 'bg-primary-light text-primary font-semibold' : 'text-gray-800'
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
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
                'w-full pl-10 pr-12 py-2.5 text-sm',
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
            <button
              type="button"
              onClick={() => {
                setShowEndTimeDropdown(prev => !prev)
                setShowStartTimeDropdown(false)
                setShowCalendar(false)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-primary transition-colors"
              aria-label={locale === 'mn' ? 'Дуусах цаг сонгох' : 'Open end time options'}
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showEndTimeDropdown && (
              <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onEndTimeChange('')
                    setShowEndTimeDropdown(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {locale === 'mn' ? 'Дуусах цаггүй' : 'No end time'}
                </button>
                <div className="border-t border-gray-100" />
                {timeOptions.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      onEndTimeChange(time)
                      setShowEndTimeDropdown(false)
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-primary-light transition-colors',
                      endTime === time ? 'bg-primary-light text-primary font-semibold' : 'text-gray-800'
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
