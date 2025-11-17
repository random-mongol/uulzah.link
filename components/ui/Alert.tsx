import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-300 text-gray-900',
        info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900 [&>svg]:text-blue-600',
        success: 'bg-green-50 border-l-4 border-green-500 text-green-900 [&>svg]:text-green-600',
        warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 [&>svg]:text-yellow-600',
        error: 'bg-red-50 border-l-4 border-red-500 text-red-900 [&>svg]:text-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const alertIcons = {
  default: null,
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
}

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  showIcon?: boolean
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', icon, showIcon = true, children, ...props }, ref) => {
    const Icon = icon || (variant && showIcon ? alertIcons[variant] : null)

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), 'animate-slide-up', className)}
        {...props}
      >
        {Icon && <div className="absolute left-4 top-3.5">{Icon}</div>}
        <div className={Icon ? 'pl-7' : ''}>{children}</div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)

AlertTitle.displayName = 'AlertTitle'

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
)

AlertDescription.displayName = 'AlertDescription'
