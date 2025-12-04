import React, { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown, Calendar, CreditCard, Repeat } from 'lucide-react';
import { Transaction, Income } from './Dashboard';

interface TransactionListProps {
  transactions: Transaction[];
  incomes: Income[];
  onDeleteTransaction: (id: string) => void;
  onDeleteIncome: (id: string) => void;
  currencySymbol: string;
}

export function TransactionList({ 
  transactions, 
  incomes, 
  onDeleteTransaction, 
  onDeleteIncome,
  currencySymbol 
}: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const allItems = [
    ...incomes.map(i => ({ ...i, type: 'income' as const })),
    ...transactions.filter(t => t.type === 'expense')
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredItems = allItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800">Historial de Transacciones</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay transacciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`p-3 rounded-lg ${
                  item.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {item.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-800">{item.category}</p>
                    {item.isRecurring && (
                      <span className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-sm">
                        <Repeat className="w-3 h-3" />
                        <span>Recurrente</span>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{item.description || 'Sin descripción'}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
                    </span>
                    {'paymentMethod' in item && item.paymentMethod && (
                      <span className="flex items-center space-x-1 text-gray-500 text-sm">
                        <CreditCard className="w-4 h-4" />
                        <span>{item.paymentMethod}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className={`${
                    item.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.type === 'income' ? '+' : '-'}{currencySymbol}
                    {item.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (item.type === 'income') {
                    onDeleteIncome(item.id);
                  } else {
                    onDeleteTransaction(item.id);
                  }
                }}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
