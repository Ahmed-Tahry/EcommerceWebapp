import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "focus-visible:ring-ring",
        purple: "border-purple-200 focus-visible:ring-purple-500 focus-visible:border-purple-500",
        blue: "border-blue-200 focus-visible:ring-blue-500 focus-visible:border-blue-500",
        green: "border-green-200 focus-visible:ring-green-500 focus-visible:border-green-500",
        orange: "border-orange-200 focus-visible:ring-orange-500 focus-visible:border-orange-500",
        pink: "border-pink-200 focus-visible:ring-pink-500 focus-visible:border-pink-500",
        cyan: "border-cyan-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-2 text-xs",
        lg: "h-11 px-4",
        xl: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return <input type={type} className={cn(inputVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
CustomInput.displayName = "CustomInput"

export { CustomInput, inputVariants }
