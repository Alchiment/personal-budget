import React, { forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
