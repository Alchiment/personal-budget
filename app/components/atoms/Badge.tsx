import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'income' | 'expense' | 'neutral' | 'accent' | 'default';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    income: "bg-income text-income-foreground",
    expense: "bg-expense text-expense-foreground",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    accent: "bg-accent text-accent-foreground",
    default: "bg-slate-100 text-slate-800"
  };

  return (
    <span 
      className={cn(
        "px-3 py-1 rounded font-mono text-sm", 
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}
