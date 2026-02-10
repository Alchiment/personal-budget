import React from 'react';
import { Icon } from '../atoms/Icon';
import { Input } from '../atoms/Input';

interface SectionHeaderProps {
  title: string;
  icon: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  isEditing?: boolean;
  onUpdateTitle?: (newTitle: string) => void;
  children?: React.ReactNode;
}

export function SectionHeader({ 
  title, 
  icon, 
  action, 
  isEditing, 
  onUpdateTitle, 
  children 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-1">
        <Icon name={icon} className="text-sm" /> 
        {isEditing && onUpdateTitle ? (
           <Input 
             value={title} 
             onChange={(e) => onUpdateTitle(e.target.value)}
             className="text-xs font-bold uppercase tracking-widest h-6 min-w-[200px]"
           />
        ) : (
          title
        )}
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
