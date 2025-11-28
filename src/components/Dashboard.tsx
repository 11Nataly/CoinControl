import React, { useState, useEffect } from 'react';
import { LogOut, TrendingUp } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { TransactionForm } from './TransactionForm';
import { IncomeForm } from './IncomeForm';
import { TransactionList } from './TransactionList';
import { CashFlowProjection } from './CashFlowProjection';
import { FinancialPatterns } from './FinancialPatterns';
import { ChartSection } from './ChartSection';

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  date: string;
  paymentMethod?: string;
  description: string;
  isRecurring: boolean;
}

export interface Income {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  isRecurring: boolean;
}

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'projections' | 'patterns'>('overview');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    setUserData(users[userEmail]);

    const storedTransactions = JSON.parse(localStorage.getItem(`${userEmail}_transactions`) || '[]');
    const storedIncomes = JSON.parse(localStorage.getItem(`${userEmail}_incomes`) || '[]');
    
    setTransactions(storedTransactions);
    setIncomes(storedIncomes);
  }, [userEmail]);

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem(`${userEmail}_transactions`, JSON.stringify(newTransactions));
  };

  const saveIncomes = (newIncomes: Income[]) => {
    setIncomes(newIncomes);
    localStorage.setItem(`${userEmail}_incomes`, JSON.stringify(newIncomes));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    saveTransactions([...transactions, newTransaction]);
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = {
      ...income,
      id: Date.now().toString(),
    };
    saveIncomes([...incomes, newIncome]);
  };

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const deleteIncome = (id: string) => {
    saveIncomes(incomes.filter(i => i.id !== id));
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const currencySymbol = userData?.currency?.symbol || '$';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <nav className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-emerald-800">Control de Gastos</h1>
                <p className="text-gray-600">¡Hola, {userData?.name}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-emerald-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-3 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Transacciones
            </button>
            <button
              onClick={() => setActiveTab('projections')}
              className={`px-6 py-3 transition-colors ${
                activeTab === 'projections'
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Proyecciones
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`px-6 py-3 transition-colors ${
                activeTab === 'patterns'
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Patrones
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <BalanceCard
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
              currencySymbol={currencySymbol}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionForm onAddTransaction={addTransaction} currencySymbol={currencySymbol} />
              <IncomeForm onAddIncome={addIncome} currencySymbol={currencySymbol} />
            </div>

            <ChartSection transactions={transactions} incomes={incomes} currencySymbol={currencySymbol} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            incomes={incomes}
            onDeleteTransaction={deleteTransaction}
            onDeleteIncome={deleteIncome}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'projections' && (
          <CashFlowProjection
            transactions={transactions}
            incomes={incomes}
            currentBalance={balance}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'patterns' && (
          <FinancialPatterns
            transactions={transactions}
            incomes={incomes}
            currencySymbol={currencySymbol}
          />
        )}
      </div>
    </div>
  );
}
