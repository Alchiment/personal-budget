export interface SectionItemDTO {
  id: string;
  name: string;
  amount: number;
  variant?: 'income' | 'expense' | 'neutral' | 'default';
}

export interface SectionDTO {
  id: string;
  title: string;
  icon: string;
  type: 'simple_list' | 'summary_list';
  total?: number;
  items: SectionItemDTO[];
  action?: {
    label: string;
  };
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
