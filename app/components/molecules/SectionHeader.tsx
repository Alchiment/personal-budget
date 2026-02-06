import React from 'react';
import { Icon } from '../atoms/Icon';

interface SectionHeaderProps {
  title: string;
  icon: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

export function SectionHeader({ title, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Icon name={icon} className="text-sm" /> {title}
      </h2>
      {action && (
        <button 
          onClick={action.onClick}
          className="text-primary text-sm font-medium hover:underline"
        >
          + {action.label}
        </button>
      )}
    </div>
  );
}
