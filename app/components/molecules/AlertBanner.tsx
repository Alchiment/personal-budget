import React from 'react';
import { cn } from '@/app/lib/utils';
import { Icon } from '../atoms/Icon';

export type AlertBannerVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertBannerProps {
  message: string;
  variant?: AlertBannerVariant;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertBannerVariant, string> = {
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
};

const iconNames: Record<AlertBannerVariant, string> = {
  error: 'error',
  success: 'check_circle',
  warning: 'warning',
  info: 'info',
};

export function AlertBanner({ message, variant = 'error', onClose, className }: AlertBannerProps) {
  return (
    <div className={cn(
      "border rounded-lg p-4",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name={iconNames[variant]} className="text-lg flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "hover:opacity-70 transition-opacity flex-shrink-0",
              variant === 'error' && "text-red-500 hover:text-red-700 dark:hover:text-red-300",
              variant === 'success' && "text-green-500 hover:text-green-700 dark:hover:text-green-300",
              variant === 'warning' && "text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-300",
              variant === 'info' && "text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
            )}
          >
            <Icon name="close" className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
}
