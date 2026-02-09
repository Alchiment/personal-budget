import React from 'react';
import { DashboardContainer } from './containers/DashboardContainer';
import { SectionDTO, SummaryDTO, DebtCardDTO } from './dtos/dashboard.dto';

// Mock Data
const sectionsData: SectionDTO[] = [
  {
    id: 'movements',
    title: 'MOVIMIENTOS / INGRESOS',
    icon: 'trending_up',
    type: 'simple_list',
    action: { label: 'Agregar' },
    items: [
      { id: '1', name: 'Salario', amount: 8059000, variant: 'income' },
      { id: '2', name: 'Credito Libranza', amount: -765000, variant: 'neutral' }, // Negative amount will be red anyway due to logic in SectionTable, variant neutral is fine or default
      { id: '3', name: 'Pago Bea', amount: 500000, variant: 'income' },
    ]
  },
  {
    id: 'physical_expenses',
    title: 'GASTOS FISICOS',
    icon: 'shopping_bag',
    type: 'summary_list',
    action: { label: 'Agregar' },
    total: 1040000,
    items: [
      { id: '1', name: 'Gasto1', amount: 600000 },
      { id: '2', name: 'Gasto2', amount: 300000 },
      { id: '3', name: 'Comida', amount: 140000 },
      { id: '4', name: 'Frutas', amount: 0 },
    ]
  },
  {
    id: 'digital_expenses',
    title: 'GASTOS DIGITALES',
    icon: 'devices',
    type: 'summary_list',
    action: { label: 'Agregar' },
    total: 3248000,
    items: [
      { id: '1', name: 'Apartamento', amount: 2220000 },
      { id: '2', name: 'Abono pago TCs + 50', amount: 185000 },
      { id: '3', name: 'Local', amount: 800000 },
    ]
  }
];

const summaryData: SummaryDTO = {
  income: 7794000,
  expenses: 7725700,
  savings: 0,
  balance: 68300,
};

const debtsData: DebtCardDTO[] = [
  {
    id: '1',
    name: 'Tarjeta Nu',
    subtitle: 'Límite utilizado',
    amount: 0,
    type: 'credit_card',
    color: 'purple',
  },
  {
    id: '2',
    name: 'BBVA Platinum',
    subtitle: 'Saldo pendiente',
    amount: 793000,
    type: 'credit_card',
    color: 'blue',
    details: [
      { name: 'Compra1', amount: 21000 },
      { name: 'Compra2', amount: 49000 },
      { name: 'Compra3', amount: 16000 },
      { name: 'Compra4', amount: 6500 },
    ]
  }
];

export default function DashboardPage() {
  console.log('STRING VARIABLE: ', 'Rendering Dashboard Page with Dynamic Sections');

  return (
    <DashboardContainer 
      sectionsData={sectionsData}
      summary={summaryData}
      debts={debtsData}
    />
  );
}
