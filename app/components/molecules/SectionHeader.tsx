import React from 'react';
import { Icon } from '../atoms/Icon';

interface SectionHeaderProps {
  title: string;
  icon: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
}

export function SectionHeader({ title, icon, action, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Icon name={icon} className="text-sm" /> {title}
      </h2>
      <div className="flex items-center gap-4">
        {children}
        {action && (
          <button 
            onClick={action.onClick}
            className="text-primary text-sm font-medium hover:underline"
          >
            + {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
