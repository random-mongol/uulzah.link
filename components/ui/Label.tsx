import { cn } from '@/lib/utils/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  children: React.ReactNode
}

export function Label({ required, children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-semibold text-gray-700 mb-2',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}
