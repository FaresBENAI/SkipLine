'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helper, ...props }, ref) => {
    
    const baseClasses = 'w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base border'
    const normalClasses = 'border-gray-300 bg-white/70 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
    const errorClasses = 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            {label}
          </label>
        )}
        <input
          className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
        )}
        {helper && !error && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
