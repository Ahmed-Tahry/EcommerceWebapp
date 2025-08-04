import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "border-border",
      purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50",
      blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50",
      green: "border-green-200 bg-gradient-to-br from-green-50 to-green-100/50",
      orange: "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50",
      pink: "border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100/50",
      cyan: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface ColorfulCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const ColorfulCard = React.forwardRef<HTMLDivElement, ColorfulCardProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
))
ColorfulCard.displayName = "ColorfulCard"

const ColorfulCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
ColorfulCardHeader.displayName = "ColorfulCardHeader"

const ColorfulCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
ColorfulCardTitle.displayName = "ColorfulCardTitle"

const ColorfulCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
ColorfulCardDescription.displayName = "ColorfulCardDescription"

const ColorfulCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
ColorfulCardContent.displayName = "ColorfulCardContent"

const ColorfulCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
ColorfulCardFooter.displayName = "ColorfulCardFooter"

export {
  ColorfulCard,
  ColorfulCardHeader,
  ColorfulCardFooter,
  ColorfulCardTitle,
  ColorfulCardDescription,
  ColorfulCardContent,
}
