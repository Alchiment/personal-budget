
import React from 'react';
import { cn } from '@/app/lib/utils';

interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function ErrorMessage({ className, message, ...props }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      className={cn("text-xs font-medium text-red-500 mt-1", className)}
      {...props}
    >
      {message}
    </p>
  );
}
