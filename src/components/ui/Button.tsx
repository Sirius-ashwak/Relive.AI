import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn-premium text-obsidian-900",
        secondary: "glass glass-hover text-white border border-white/20 hover:border-aurora-400/50",
        ghost: "hover:bg-white/10 text-white",
        destructive: "bg-coral-500 text-white hover:bg-coral-600",
        outline: "border border-white/20 bg-transparent text-white hover:bg-white/10"
      },
      size: {
        default: "px-8 py-4 text-lg",
        sm: "px-4 py-2 text-sm",
        lg: "px-10 py-5 text-xl",
        icon: "h-12 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }