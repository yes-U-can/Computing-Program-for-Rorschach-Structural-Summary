'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'text-white shadow-sm focus:ring-[var(--brand-500)] bg-[var(--brand-700)] hover:bg-[var(--brand-700-hover)] active:bg-[var(--brand-700-hover)]',
      secondary: 'bg-white border border-[var(--brand-200)] text-[var(--brand-700)] hover:bg-[#EEF3F7] focus:ring-[var(--brand-500)]',
      ghost: 'text-slate-600 hover:text-[var(--brand-700)] hover:bg-slate-100 focus:ring-[var(--brand-500)]',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-500'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-5 py-2.5 text-sm rounded-lg'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
