import * as React from "react"
import { cn } from "@/lib/utils"

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDetailsElement> {
  value: string
}

export interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, children, ...props }, ref) => (
    <details
      ref={ref}
      className={cn(
        "group rounded-lg border border-gray-200 bg-white px-6 py-4 hover:border-green-300 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </details>
  )
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <summary
      className={cn(
        "flex cursor-pointer items-center justify-between font-semibold text-gray-900 hover:text-green-600 transition-colors list-none [&::-webkit-details-marker]:hidden",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
  )
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pt-4 text-gray-700 leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  )
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

