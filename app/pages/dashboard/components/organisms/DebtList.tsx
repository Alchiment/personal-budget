import React from 'react';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { DebtCardDTO, DebtItemDTO } from '../../dtos/dashboard.dto';
import { DebtCard } from '../molecules/DebtCard';
import { Button } from '@/app/components/atoms/Button';
import { Icon } from '@/app/components/atoms/Icon';

interface DebtListProps {
  debts: DebtCardDTO[];
  onAddDetail?: (debtId: string) => void;
  onRemoveDetail?: (debtId: string, detailId: string) => void;
  onUpdateDetail?: (debtId: string, detailId: string, updates: Partial<DebtItemDTO>) => void;
  onUpdateDebt?: (debtId: string, updates: Partial<DebtCardDTO>) => void;
  onAddDebt?: () => void;
}

export function DebtList({ 
  debts,
  onAddDetail,
  onRemoveDetail,
  onUpdateDetail,
  onUpdateDebt,
  onAddDebt
}: DebtListProps) {
  return (
    <section>
      <SectionHeader title="TARJETAS & DEUDAS" icon="credit_card" />
      <div className="space-y-4">
        {debts.map((debt) => (
          <DebtCard
            key={debt.id}
            debt={debt}
            onAddDetail={onAddDetail}
            onRemoveDetail={onRemoveDetail}
            onUpdateDetail={onUpdateDetail}
            onUpdateDebt={onUpdateDebt}
          />
        ))}
        {onAddDebt && (
          <Button 
            variant="ghost" 
            className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-400 hover:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center justify-center gap-2 transition-all"
            onClick={onAddDebt}
          >
            <Icon name="add_card" className="text-xl opacity-50" />
            <span className="font-medium text-sm">Agregar Nueva Tarjeta</span>
          </Button>
        )}
      </div>
    </section>
  );
}
