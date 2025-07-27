'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    
    const variants = {
      primary: 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:shadow-lg hover:scale-105',
      secondary: 'text-violet-600 hover:text-violet-800 border-2 border-violet-200 hover:bg-violet-50',
      success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-lg hover:scale-105',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105'
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
      lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg'
    }

    const baseClasses = 'rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center'

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Chargement...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
