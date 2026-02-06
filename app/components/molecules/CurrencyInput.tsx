import React, { useState, useEffect } from 'react';
import { Input } from '../atoms/Input';
import { cn } from '@/app/lib/utils';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export function CurrencyInput({ value, onChange, className, placeholder }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else if (newValue === '') {
      onChange(0);
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
      <Input
        type="number"
        value={displayValue}
        onChange={handleChange}
        className={cn("pl-7 text-right font-mono", className)}
        placeholder={placeholder}
      />
    </div>
  );
}
