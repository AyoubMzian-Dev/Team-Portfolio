"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary gradient button
        gradient: "gradient-button",
        
        // Glassmorphism button
        glass: "glass-card text-foreground hover:border-white/20",
        
        // Neon glow button
        neon: "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background glow-effect neon-button",
        
        // Solid modern button
        solid: "bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg",
        
        // Outlined glass button
        outline: "border-2 border-accent/50 bg-transparent text-accent hover:bg-accent/10 hover:border-accent",
        
        // Subtle glass button
        subtle: "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 hover:border-accent/40",
        
        // Destructive gradient
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5",
        
        // Success gradient
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5",
        
        // Warning gradient
        warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5",
        
        // Ghost with hover effect
        ghost: "text-foreground hover:bg-accent/10 hover:text-accent",
        
        // Premium luxury button
        luxury: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden",
        
        // Cyber tech button
        cyber: "bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold border border-cyan-300 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 cyber-button",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      glow: {
        none: "",
        soft: "hover:shadow-lg hover:shadow-accent/30",
        medium: "hover:shadow-xl hover:shadow-accent/40",
        strong: "hover:shadow-2xl hover:shadow-accent/50",
      },
    },
    defaultVariants: {
      variant: "gradient",
      size: "default",
      glow: "none",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, glow, asChild = false, loading, icon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          enhancedButtonVariants({ variant, size, glow, className }),
          loading && "cursor-not-allowed opacity-70"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }
