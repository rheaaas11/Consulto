import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-accent',
      secondary: 'bg-line text-text-main hover:bg-line/80',
      outline: 'border border-line bg-transparent hover:bg-primary hover:text-white',
      ghost: 'bg-transparent hover:bg-line',
      danger: 'bg-danger text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'h-8 px-3 text-[10px] uppercase font-mono tracking-widest',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-14 px-10 text-lg',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-button font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
