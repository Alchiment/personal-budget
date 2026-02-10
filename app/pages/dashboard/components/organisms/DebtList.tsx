import React from 'react';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { DebtCardDTO, DebtItemDTO } from '../../dtos/dashboard.dto';
import { DebtCard } from '../molecules/DebtCard';

interface DebtListProps {
  debts: DebtCardDTO[];
  onAddDetail?: (debtId: string) => void;
  onRemoveDetail?: (debtId: string, detailId: string) => void;
  onUpdateDetail?: (debtId: string, detailId: string, updates: Partial<DebtItemDTO>) => void;
  onUpdateDebt?: (debtId: string, updates: Partial<DebtCardDTO>) => void;
}

export function DebtList({ 
  debts,
  onAddDetail,
  onRemoveDetail,
  onUpdateDetail,
  onUpdateDebt
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
      </div>
    </section>
  );
}
