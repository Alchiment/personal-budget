import React from 'react';
import { Card } from '@/app/components/atoms/Card';
import { Badge } from '@/app/components/atoms/Badge';
import { Button } from '@/app/components/atoms/Button';
import { Icon } from '@/app/components/atoms/Icon';
import { Input } from '@/app/components/atoms/Input';
import { CurrencyInput } from '@/app/components/molecules/CurrencyInput';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { SectionDTO, SectionItemDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/app/lib/format';
import { cn } from '@/app/lib/utils';

interface SectionTableProps {
  section: SectionDTO;
  onAdd?: () => void;
  onRemove?: (itemId: string) => void;
  onUpdate?: (itemId: string, updates: Partial<SectionItemDTO>) => void;
  onUpdateSection?: (updates: Partial<SectionDTO>) => void;
}

export function SectionTable({ section, onAdd, onRemove, onUpdate, onUpdateSection }: SectionTableProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  
  const headerAction = (section.action && isEditing) ? { ...section.action, onClick: onAdd } : undefined;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <section>
      <SectionHeader 
        title={section.title} 
        icon={section.icon} 
        action={headerAction} 
        isEditing={isEditing}
        onUpdateTitle={onUpdateSection ? (newTitle) => onUpdateSection({ title: newTitle }) : undefined}
      >
        {onUpdate && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-6 w-6 rounded-full transition-colors",
                isEditing ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-400 hover:text-slate-600"
            )}
            onClick={toggleEdit}
            title={isEditing ? "Finalizar edición" : "Editar sección"}
          >
            <Icon name={isEditing ? "check" : "edit"} className="text-sm" />
          </Button>
        )}
      </SectionHeader>
      <Card noPadding>
        <table className="w-full text-left border-collapse">
          <tbody>
            {/* Render Total Row if it's a summary_list */}
            {section.type === 'summary_list' && section.total !== undefined && (
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="p-4 font-semibold">Total Actual</td>
                <td className="p-4 text-right">
                  <Badge variant="expense">
                    {formatCurrency(section.total)}
                  </Badge>
                </td>
                {onRemove && <td></td>}
              </tr>
            )}

            {/* Render Items */}
            {section.items.map((item, index) => {
              const isLast = index === section.items.length - 1;
              const isExpenseRow = section.type === 'summary_list';
              
              return (
                <tr 
                  key={item.id} 
                  className={cn(
                    !isLast ? "border-b border-slate-100 dark:border-slate-800" : "",
                    isExpenseRow && "border-t border-slate-100 dark:border-slate-800",
                    "group"
                  )}
                >
                  <td className={cn("p-4", isExpenseRow && "text-sm")}>
                    {isEditing && onUpdate ? (
                      <Input 
                        value={item.name} 
                        onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                        className="h-8 w-full max-w-[200px]"
                        placeholder="Concepto"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className={cn("p-4 text-right", isExpenseRow && "font-mono text-sm")}>
                    {isEditing && onUpdate ? (
                      <div className="flex justify-end">
                        <CurrencyInput 
                          value={item.amount} 
                          onChange={(val) => onUpdate(item.id, { amount: val })}
                          className="w-32 h-8"
                        />
                      </div>
                    ) : (
                      section.type === 'simple_list' ? (
                        <Badge 
                          variant={item.variant || (item.amount > 0 ? 'income' : 'neutral')}
                          className={item.amount < 0 ? "text-red-500 bg-transparent" : ""}
                        >
                           {formatCurrency(item.amount)}
                        </Badge>
                      ) : (
                        <span className={item.amount === 0 ? "text-slate-400" : ""}>
                          {formatCurrency(item.amount)}
                        </span>
                      )
                    )}
                  </td>
                  {onRemove && isEditing && (
                    <td className="p-4 w-10 text-center transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-8 w-8 text-slate-400 hover:text-red-500"
                        )}
                        onClick={() => onRemove(item.id)}
                      >
                        <Icon name="delete" className="text-lg" />
                      </Button>
                    </td>
                  )}
                  {onRemove && !isEditing && (
                     <td className="p-4 w-10"></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
