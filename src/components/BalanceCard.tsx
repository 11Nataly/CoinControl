// src/components/BalanceCard.tsx
import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currencySymbol: string;
}

export function BalanceCard({ totalIncome, totalExpenses, balance, currencySymbol }: BalanceCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Wallet className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <p className="text-gray-600 mb-1">Saldo Disponible</p>
        <h2 className={`${balance >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
          {currencySymbol}{balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-gray-600 mb-1">Ingresos Totales</p>
        <h2 className="text-green-700">
          {currencySymbol}{totalIncome.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-red-100 p-3 rounded-lg">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <p className="text-gray-600 mb-1">Gastos Totales</p>
        <h2 className="text-red-700">
          {currencySymbol}{totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>
    </div>
  );
}