import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { CashFlowPrediction } from './components/CashFlowPrediction';
import { Header } from './components/FinanceHeader';
import { Transaction } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Header balance={balance} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-white/50 backdrop-blur">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="add">Agregar</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard
              transactions={transactions}
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList
              transactions={transactions}
              onDelete={deleteTransaction}
              onUpdate={updateTransaction}
            />
          </TabsContent>

          <TabsContent value="add">
            <div className="max-w-2xl mx-auto">
              <TransactionForm onSubmit={addTransaction} />
            </div>
          </TabsContent>

          <TabsContent value="predictions">
            <CashFlowPrediction transactions={transactions} balance={balance} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
