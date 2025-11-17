'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

type ToastVariant = 'default' | 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  onClose: () => void
}

export function Toast({ message, variant = 'default', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const variantStyles = {
    default: 'bg-gray-900 text-white border-gray-800',
    success: 'bg-green-50 text-green-900 border-green-500',
    error: 'bg-red-50 text-red-900 border-red-500',
    info: 'bg-blue-50 text-blue-900 border-blue-500',
  }

  const icons = {
    default: null,
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 px-4 py-3 rounded-lg border-l-4 shadow-xl transition-all duration-300 z-50 min-w-[300px]',
        variantStyles[variant],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className="flex items-start gap-3">
        {icons[variant]}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className={cn(
            'transition-colors rounded-full p-0.5',
            variant === 'default' ? 'text-gray-400 hover:text-white' : 'opacity-60 hover:opacity-100'
          )}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; variant?: ToastVariant }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
