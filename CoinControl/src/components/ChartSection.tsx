import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, Income } from './Dashboard';

interface ChartSectionProps {
  transactions: Transaction[];
  incomes: Income[];
  currencySymbol: string;
}

export function ChartSection({ transactions, incomes, currencySymbol }: ChartSectionProps) {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  const incomesByCategory = incomes.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomeData = Object.entries(incomesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyData = last30Days.map(date => {
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const dayIncomes = incomes
      .filter(i => i.date === date)
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      date: new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      gastos: parseFloat(dayExpenses.toFixed(2)),
      ingresos: parseFloat(dayIncomes.toFixed(2))
    };
  });

  const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#f0fdfa'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-800">{`${payload[0].name}: ${currencySymbol}${payload[0].value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 mb-6">Gastos e Ingresos - Últimos 30 días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: number) => `${currencySymbol}${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            />
            <Legend />
            <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-800 mb-6">Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {incomeData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-800 mb-6">Ingresos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
