import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className, noPadding = false, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
        !noPadding && "p-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
