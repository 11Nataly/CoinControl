// src/components/CashFlowProjection.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { listarTransacciones } from '../services/transaccionesService';

interface CashFlowProjectionProps {
  currencySymbol: string;
}

export function CashFlowProjection({ currencySymbol }: CashFlowProjectionProps) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarTransacciones();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Cargando proyecciones...</div>;
  }

  // Filtrar gastos e ingresos
  const expenses = transactions.filter(t => t.categoria.tipo === 'gasto');
  const incomes = transactions.filter(t => t.categoria.tipo === 'ingreso');

  const recurringIncomes = incomes.filter(i => i.es_recurrente);
  const recurringExpenses = expenses.filter(t => t.es_recurrente);

  const monthlyRecurringIncome = recurringIncomes.reduce((sum, i) => sum + i.monto, 0);
  const monthlyRecurringExpenses = recurringExpenses.reduce((sum, t) => sum + t.monto, 0);

  const last3MonthsExpenses = expenses
    .filter(t => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return new Date(t.fecha) >= threeMonthsAgo;
    })
    .reduce((sum, t) => sum + t.monto, 0);

  const last3MonthsIncome = incomes
    .filter(i => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return new Date(i.fecha) >= threeMonthsAgo;
    })
    .reduce((sum, i) => sum + i.monto, 0);

  const avgMonthlyExpenses = last3MonthsExpenses / 3 || 0;
  const avgMonthlyIncome = last3MonthsIncome / 3 || 0;

  const projectedMonthlyIncome = monthlyRecurringIncome || avgMonthlyIncome;
  const projectedMonthlyExpenses = monthlyRecurringExpenses || avgMonthlyExpenses;
  const projectedMonthlySavings = projectedMonthlyIncome - projectedMonthlyExpenses;

  const currentBalance = incomes.reduce((sum, i) => sum + i.monto, 0) - expenses.reduce((sum, t) => sum + t.monto, 0);

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
          <h2 className="text-2xl font-bold">Proyección de Flujo de Caja</h2>
        </div>
        <p className="text-emerald-50 mb-6">
          Predicción basada en tus ingresos y gastos recurrentes, y promedios históricos de los últimos 3 meses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-emerald-100 text-sm mb-1">Balance Actual</p>
            <p className="text-2xl font-bold text-white">
              {currencySymbol}{currentBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-emerald-100 text-sm mb-1">Proyección a 6 meses</p>
            <p className="text-2xl font-bold text-white">
              {currencySymbol}{sixMonthBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-emerald-100 text-sm mb-1">Ahorro Mensual Proyectado</p>
            <p className={`text-2xl font-bold ${projectedMonthlySavings >= 0 ? 'text-white' : 'text-red-200'}`}>
              {currencySymbol}{projectedMonthlySavings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {!isPositiveProjection && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-red-800">¡Alerta de Flujo de Caja Negativo!</p>
            <p className="text-red-700 text-sm mt-1">
              Según tus patrones actuales, tu balance disminuirá en los próximos meses. 
              Considera reducir gastos o aumentar ingresos.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Proyección de Balance - Próximos 6 Meses</h3>
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
            <h3 className="font-semibold text-gray-800">Ingresos Mensuales Proyectados</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {currencySymbol}{projectedMonthlyIncome.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
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
            <h3 className="font-semibold text-gray-800">Gastos Mensuales Proyectados</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {currencySymbol}{projectedMonthlyExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {recurringExpenses.length > 0 
              ? `Basado en ${recurringExpenses.length} gasto(s) recurrente(s)`
              : 'Basado en promedio de últimos 3 meses'
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Proyección</h3>
        <div className="space-y-3">
          {projectionData.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-800">{data.month}</p>
                <p className="text-sm text-gray-600">
                  Ingreso: {currencySymbol}{data.income.toLocaleString('es-ES', { minimumFractionDigits: 2 })} | 
                  Gasto: {currencySymbol}{data.expenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <p className={`text-lg font-semibold ${data.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {currencySymbol}{data.balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}