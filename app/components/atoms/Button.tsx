import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
    outline: "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800",
    white: "bg-white text-slate-800 hover:bg-slate-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2 rounded-full"
  };

  return (
    <button 
      className={cn(
        "font-medium transition-colors duration-200 rounded-lg flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
