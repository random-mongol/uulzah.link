'use client'

import { cn } from '@/lib/utils/cn'

type CellStatus = '' | 'yes' | 'maybe'

interface GridCellProps {
  status: CellStatus
  onClick: () => void
  label: string
}

export function GridCell({ status, onClick, label }: GridCellProps) {
  const statusStyles = {
    '': 'bg-gray-100 border-gray-300',
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
      className={cn(
        'w-full aspect-square min-w-[48px] min-h-[48px] border-2 rounded-lg',
        'flex items-center justify-center text-2xl font-bold',
        'transition-all duration-150 active:scale-95',
        'hover:shadow-md focus:outline-none focus:ring-3 focus:ring-primary-light',
        statusStyles[status]
      )}
    >
      {statusIcons[status] && (
        <span
          className={cn(
            'animate-pop',
            status === 'yes' && 'text-green-600',
            status === 'maybe' && 'text-yellow-600'
          )}
        >
          {statusIcons[status]}
        </span>
      )}
    </button>
  )
}
