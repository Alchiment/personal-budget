import React from 'react';
import { Card } from '@/app/components/atoms/Card';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { DebtCardDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/app/lib/format';
import { cn } from '@/app/lib/utils';

interface DebtListProps {
  debts: DebtCardDTO[];
}

export function DebtList({ debts }: DebtListProps) {
  return (
    <section>
      <SectionHeader title="TARJETAS & DEUDAS" icon="credit_card" />
      <div className="space-y-4">
        {debts.map((debt) => (
          <Card 
            key={debt.id} 
            className={cn(
              "border-l-4", 
              debt.color === 'purple' ? "border-purple-500" : "border-blue-600"
            )}
            noPadding
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{debt.name}</h3>
                  <p className="text-xs text-slate-500">{debt.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "font-mono font-bold", 
                    debt.amount === 0 ? "text-slate-400" : "text-red-500"
                  )}>
                    {formatCurrency(debt.amount)}
                  </span>
                </div>
              </div>
              
              {debt.details && debt.details.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Detalle Deudas</span>
                  </div>
                  <div className="space-y-2">
                    {debt.details.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                        <span className="font-mono">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
