export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'housing'
  | 'utilities'
  | 'shopping'
  | 'other';

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'sales'
  | 'investment'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  description: string;
  isRecurring: boolean;
  recurringDay?: number; // día del mes para recurrencia
}

export interface Prediction {
  month: string;
  predictedIncome: number;
  predictedExpense: number;
  predictedBalance: number;
  confidence: 'high' | 'medium' | 'low';
}
