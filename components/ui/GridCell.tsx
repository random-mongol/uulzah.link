'use client'

import { cn } from '@/lib/utils/cn'
import { t, type Locale } from '@/lib/i18n/translations'

type CellStatus = '' | 'yes' | 'maybe'

interface GridCellProps {
  status: CellStatus
  onClick: () => void
  label: string
  dateLabel: string // e.g., "11/21"
  dayLabel: string // e.g., "Fri"
  timeLabel: string // e.g., "19:00 - 21:00" or "19:00"
  locale?: Locale
  dateId?: number
}

export function GridCell({ status, onClick, label, dateLabel, dayLabel, timeLabel, locale = 'mn', dateId }: GridCellProps) {
  const statusStyles = {
    '': 'bg-white border-gray-300 hover:border-gray-400',
    yes: 'bg-green-50 border-green-500',
    maybe: 'bg-yellow-50 border-yellow-500',
  }

  const statusIcons = {
    '': '',
    yes: '✓',
    maybe: '?',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={status !== ''}
      data-testid={dateId !== undefined ? `grid-cell-${dateId}` : undefined}
      className={cn(
        'w-full min-w-[100px] border-2 rounded-lg p-3',
        'flex flex-col items-center justify-between gap-2',
        'transition-all duration-150 active:scale-95',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-light',
        statusStyles[status]
      )}
    >
      {/* Date and Time Info */}
      <div className="flex flex-col items-center gap-0.5 text-sm">
        <div className="font-bold text-gray-900">{dateLabel}</div>
        <div className="text-xs text-gray-600">{dayLabel}</div>
        <div className="text-xs text-gray-700 font-medium whitespace-nowrap">{timeLabel}</div>
      </div>

      {/* Status Indicator */}
      <div className="w-full flex items-center justify-center">
        {statusIcons[status] ? (
          <span
            className={cn(
              'text-3xl font-bold animate-pop',
              status === 'yes' && 'text-green-600',
              status === 'maybe' && 'text-yellow-600'
            )}
          >
            {statusIcons[status]}
          </span>
        ) : (
          <span className="text-xs text-gray-400">{t('common.clickToSelect', locale)}</span>
        )}
      </div>
    </button>
  )
}
