import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { Transaction, Income } from './Dashboard';

interface CashFlowProjectionProps {
  transactions: Transaction[];
  incomes: Income[];
  currentBalance: number;
  currencySymbol: string;
}

export function CashFlowProjection({ transactions, incomes, currentBalance, currencySymbol }: CashFlowProjectionProps) {
  const recurringIncomes = incomes.filter(i => i.isRecurring);
  const recurringExpenses = transactions.filter(t => t.type === 'expense' && t.isRecurring);

  const monthlyRecurringIncome = recurringIncomes.reduce((sum, i) => sum + i.amount, 0);
  const monthlyRecurringExpenses = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);

  const last3MonthsExpenses = transactions
    .filter(t => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return new Date(t.date) >= threeMonthsAgo && t.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const last3MonthsIncome = incomes
    .filter(i => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return new Date(i.date) >= threeMonthsAgo;
    })
    .reduce((sum, i) => sum + i.amount, 0);

  const avgMonthlyExpenses = last3MonthsExpenses / 3;
  const avgMonthlyIncome = last3MonthsIncome / 3;

  const projectedMonthlyIncome = monthlyRecurringIncome || avgMonthlyIncome;
  const projectedMonthlyExpenses = monthlyRecurringExpenses || avgMonthlyExpenses;
  const projectedMonthlySavings = projectedMonthlyIncome - projectedMonthlyExpenses;

  const projectionData = [...Array(6)].map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    const balance = currentBalance + (projectedMonthlySavings * i);
    
    return {
      month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      balance: parseFloat(balance.toFixed(2)),
      income: parseFloat(projectedMonthlyIncome.toFixed(2)),
      expenses: parseFloat(projectedMonthlyExpenses.toFixed(2))
    };
  });

  const sixMonthBalance = projectionData[5].balance;
  const isPositiveProjection = sixMonthBalance > currentBalance;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8" />
          <h2>Proyección de Flujo de Caja</h2>
        </div>
        <p className="text-emerald-50 mb-6">
          Predicción basada en tus ingresos y gastos recurrentes, y promedios históricos de los últimos 3 meses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-emerald-100 mb-1">Balance Actual</p>
            <p className="text-white">
              {currencySymbol}{currentBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-emerald-100 mb-1">Proyección a 6 meses</p>
            <p className="text-white">
              {currencySymbol}{sixMonthBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-emerald-100 mb-1">Ahorro Mensual Proyectado</p>
            <p className={`${projectedMonthlySavings >= 0 ? 'text-white' : 'text-red-200'}`}>
              {currencySymbol}{projectedMonthlySavings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {!isPositiveProjection && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-red-800">¡Alerta de Flujo de Caja Negativo!</p>
            <p className="text-red-700 mt-1">
              Según tus patrones actuales, tu balance disminuirá en los próximos meses. 
              Considera reducir gastos o aumentar ingresos.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 mb-6">Proyección de Balance - Próximos 6 Meses</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: number) => `${currencySymbol}${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Balance Proyectado"
              dot={{ fill: '#10b981', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-800">Ingresos Mensuales Proyectados</h3>
          </div>
          <p className="text-green-600">
            {currencySymbol}{projectedMonthlyIncome.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-600 mt-2">
            {recurringIncomes.length > 0 
              ? `Basado en ${recurringIncomes.length} ingreso(s) recurrente(s)`
              : 'Basado en promedio de últimos 3 meses'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-gray-800">Gastos Mensuales Proyectados</h3>
          </div>
          <p className="text-red-600">
            {currencySymbol}{projectedMonthlyExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-600 mt-2">
            {recurringExpenses.length > 0 
              ? `Basado en ${recurringExpenses.length} gasto(s) recurrente(s)`
              : 'Basado en promedio de últimos 3 meses'
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 mb-4">Detalles de la Proyección</h3>
        <div className="space-y-3">
          {projectionData.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-800">{data.month}</p>
                <p className="text-gray-600">
                  Ingreso: {currencySymbol}{data.income.toLocaleString('es-ES', { minimumFractionDigits: 2 })} | 
                  Gasto: {currencySymbol}{data.expenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <p className={`${data.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {currencySymbol}{data.balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
