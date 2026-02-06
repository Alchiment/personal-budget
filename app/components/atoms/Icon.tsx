import React from 'react';
import { cn } from '@/app/lib/utils';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <span className={cn("material-symbols-outlined", className)} {...props}>
      {name}
    </span>
  );
}
