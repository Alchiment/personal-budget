import React from 'react';
import { Card } from '@/app/components/atoms/Card';
import { Icon } from '@/app/components/atoms/Icon';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { SummaryDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/app/lib/format';

interface SummaryCardProps {
  summary: SummaryDTO;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <section>
      <SectionHeader title="PONDERADOS" icon="analytics" />
      <Card className="rounded-2xl shadow-xl relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Ingresos</span>
            <span className="px-3 py-1 rounded bg-accent dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 font-mono font-bold">
              {formatCurrency(summary.income)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Egresos</span>
            <span className="px-3 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-mono font-bold">
              -{formatCurrency(summary.expenses)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Ahorros</span>
            <span className="font-mono text-slate-400">{formatCurrency(summary.savings)}</span>
          </div>
          
          <hr className="border-slate-200 dark:border-slate-800 my-4"/>
          
          <div className="bg-green-600 dark:bg-green-700 text-white p-5 rounded-xl flex justify-between items-center shadow-lg shadow-green-500/20">
            <div>
              <span className="text-xs uppercase font-bold tracking-tighter opacity-80">Saldo Disponible</span>
              <div className="text-3xl font-mono font-bold">{formatCurrency(summary.balance)}</div>
            </div>
            <Icon name="savings" className="text-4xl opacity-50" />
          </div>
        </div>
      </Card>
    </section>
  );
}
