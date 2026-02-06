export interface MovementDTO {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface ExpenseDTO {
  id: string;
  name: string;
  amount: number;
}

export interface ExpenseCategoryDTO {
  title: string;
  icon: string;
  total: number;
  items: ExpenseDTO[];
}

export interface DebtItemDTO {
  name: string;
  amount: number;
}

export interface DebtCardDTO {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  type: 'credit_card';
  color: 'purple' | 'blue'; // Visual hint
  details?: DebtItemDTO[];
}

export interface SummaryDTO {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}
