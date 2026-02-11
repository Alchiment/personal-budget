
import React from 'react';
import { Label } from '../atoms/Label';
import { Input, InputProps } from '../atoms/Input';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { cn } from '@/app/lib/utils';

interface FormFieldProps extends Omit<InputProps, 'id'> {
  label: string;
  id: string;
  errorMessage?: string;
  containerClassName?: string;
}

export function FormField({
  label,
  id,
  errorMessage,
  containerClassName,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        error={!!errorMessage}
        className={className}
        {...props}
      />
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
