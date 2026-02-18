import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
      outline: "border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100",
      ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

