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
    addDebt,
    requestRemoveDebt
  } = useDashboardContext();

  return (
    <DebtList 
      debts={debts}
      onAddDetail={addDebtDetail}
      onRemoveDetail={removeDebtDetail}
      onUpdateDetail={updateDebtDetail}
      onUpdateDebt={updateDebt}
      onRemoveDebt={requestRemoveDebt}
      onAddDebt={addDebt}
    />
  );
}
