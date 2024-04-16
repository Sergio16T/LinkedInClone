import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'sm:rounded-xl border bg-card text-card-foreground shadow',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn('flex flex-row space-y-1.5 p-6', className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h6
    className={cn('font-semibold leading-none tracking-tight', className)}
    ref={ref}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cn('p-6 pt-0 text-sm', className)} ref={ref} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    ref={ref}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

const CardRow= React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn('flex p-6 pt-0', className)}
    ref={ref}
    {...props}
  />
))
CardRow.displayName = 'CardRow'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardRow }
