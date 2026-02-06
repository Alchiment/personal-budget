import React from 'react';
import { Card } from '@/app/components/atoms/Card';
import { Badge } from '@/app/components/atoms/Badge';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { SectionDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/app/lib/format';
import { cn } from '@/app/lib/utils';

interface SectionTableProps {
  section: SectionDTO;
}

export function SectionTable({ section }: SectionTableProps) {
  return (
    <section>
      <SectionHeader 
        title={section.title} 
        icon={section.icon} 
        action={section.action} 
      />
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
                    isExpenseRow && "border-t border-slate-100 dark:border-slate-800"
                  )}
                >
                  <td className={cn("p-4", isExpenseRow && "text-sm")}>{item.name}</td>
                  <td className={cn("p-4 text-right", isExpenseRow && "font-mono text-sm")}>
                    {section.type === 'simple_list' ? (
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
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
