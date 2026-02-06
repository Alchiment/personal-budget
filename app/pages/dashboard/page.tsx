import { DashboardTemplate } from './templates/DashboardTemplate';
import { MovementsTable } from './components/organisms/MovementsTable';
import { ExpensesTable } from './components/organisms/ExpensesTable';
import { SummaryCard } from './components/organisms/SummaryCard';
import { DebtList } from './components/organisms/DebtList';
import { ExportCard } from './components/organisms/ExportCard';
import { MovementDTO, ExpenseCategoryDTO, SummaryDTO, DebtCardDTO } from './dtos/dashboard.dto';

// Mock Data matching the HTML/Screenshot
const movementsData: MovementDTO[] = [
  { id: '1', name: 'Salario', amount: 5000000, type: 'income' },
  { id: '2', name: 'Credito Libranza', amount: -765000, type: 'expense' },
  { id: '3', name: 'Pago Tercero', amount: 500000, type: 'income' },
];

const physicalExpensesData: ExpenseCategoryDTO = {
  title: 'GASTOS FISICOS',
  icon: 'shopping_bag',
  total: 1040000,
  items: [
    { id: '1', name: 'Aporte tercero1', amount: 600000 },
    { id: '2', name: 'Aporte tercero2', amount: 300000 },
    { id: '3', name: 'Comida', amount: 140000 },
    { id: '4', name: 'Frutas', amount: 0 },
  ]
};

const digitalExpensesData: ExpenseCategoryDTO = {
  title: 'GASTOS DIGITALES',
  icon: 'devices',
  total: 3248000,
  items: [
    { id: '1', name: 'Apartamento', amount: 2220000 },
    { id: '2', name: 'Abono pago TCs + 50', amount: 185000 },
    { id: '3', name: 'Local', amount: 800000 },
  ]
};

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
      { name: 'Computador', amount: 270000 },
      { name: 'Facebook Ads', amount: 9400 },
      { name: 'Compra1', amount: 21000 },
      { name: 'Compra2', amount: 49000 },
      { name: 'Compra3', amount: 16000 },
      { name: 'Compra4', amount: 6500 },
    ]
  }
];

export default function DashboardPage() {
  console.log('STRING VARIABLE: ', 'Rendering Dashboard Page'); // User Rule 3

  return (
    <DashboardTemplate 
      movements={<MovementsTable movements={movementsData} />}
      physicalExpenses={<ExpensesTable category={physicalExpensesData} />}
      digitalExpenses={<ExpensesTable category={digitalExpensesData} />}
      summary={<SummaryCard summary={summaryData} />}
      debts={<DebtList debts={debtsData} />}
      exportCard={<ExportCard />}
    />
  );
}
