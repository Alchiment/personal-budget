'use client';

import React from 'react';
import { useDashboardContext } from '../hooks/useDashboardContext';
import { DebtList } from '../components/organisms/DebtList';

export function DebtsContainer() {
  const { 
    debts, 
    addDebtDetail, 
    removeDebtDetail, 
    updateDebtDetail,
    updateDebt,
    addDebt
  } = useDashboardContext();

  return (
    <DebtList 
      debts={debts}
      onAddDetail={addDebtDetail}
      onRemoveDetail={removeDebtDetail}
      onUpdateDetail={updateDebtDetail}
      onUpdateDebt={updateDebt}
      onAddDebt={addDebt}
    />
  );
}
