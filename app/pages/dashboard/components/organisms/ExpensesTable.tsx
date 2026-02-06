import React from 'react';
import { Card } from '@/app/components/atoms/Card';
import { Badge } from '@/app/components/atoms/Badge';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { ExpenseCategoryDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ExpensesTableProps {
  category: ExpenseCategoryDTO;
}

export function ExpensesTable({ category }: ExpensesTableProps) {
  return (
    <section>
      <SectionHeader title={category.title} icon={category.icon} />
      <Card noPadding>
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <td className="p-4 font-semibold">Total Actual</td>
              <td className="p-4 text-right">
                <Badge variant="expense">
                  {formatCurrency(category.total)}
                </Badge>
              </td>
            </tr>
            {category.items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 text-sm">{item.name}</td>
                <td className={cn("p-4 text-right font-mono text-sm", item.amount === 0 ? "text-slate-400" : "")}>
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
