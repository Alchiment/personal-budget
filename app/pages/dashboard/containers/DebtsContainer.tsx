'use client';

import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { DebtList } from '../components/organisms/DebtList';

export function DebtsContainer() {
  const { 
    debts, 
    addDebtDetail, 
    removeDebtDetail, 
    updateDebtDetail,
    updateDebt,
    addDebt
  } = useDashboard();

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
