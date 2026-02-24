import React from 'react';
import { Button } from '@/app/components/atoms/Button';
import { cn } from '@/app/lib/utils';

interface ConfirmModalInterface {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalInterface) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 shadow-xl p-6 flex flex-col gap-4">
        <h2
          id="confirm-modal-title"
          className="text-base font-semibold text-slate-800 dark:text-slate-100"
        >
          {title}
        </h2>

        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            className={cn('bg-red-500 hover:bg-red-600 text-white')}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
