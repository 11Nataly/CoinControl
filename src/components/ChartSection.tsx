// src/components/ChartSection.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RawTransaction {
  id: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  origen?: string;
  destino?: string;
  es_recurrente?: boolean;
  metodo_pago?: string;
  categoria: {
    nombre: string;
    tipo: 'ingreso' | 'gasto';
  };
}

interface ChartSectionProps {
  transactions: RawTransaction[];
  currencySymbol?: string;
}

const COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#10b981', '#3b82f6', '#14b8a6'];

export function ChartSection({ transactions = [], currencySymbol = '$' }: ChartSectionProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Solo gastos pasados o de hoy (igual que FinancialPatterns)
  const pastExpenses = transactions.filter(
    t => t.categoria.tipo === 'gasto' && new Date(t.fecha) <= today
  );

  // Agrupar por categoría
  const expensesByCategory = pastExpenses.reduce((acc, t) => {
    const catName = t.categoria.nombre;
    acc[catName] = (acc[catName] || 0) + t.monto;
    return acc;
  }, {} as Record<string, number>);

  const totalGastos = Object.values(expensesByCategory).reduce((sum, v) => sum + v, 0);

  const data = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalGastos > 0 ? ((value / totalGastos) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Distribución de Gastos</h3>
        <div className="text-center py-16">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-40 h-40 mx-auto mb-6 opacity-50" />
          <p className="text-lg font-medium text-gray-600">Aún no tienes gastos registrados</p>
          <p className="text-sm text-gray-500 mt-2">El gráfico aparecerá cuando agregues transacciones de gasto</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200">
          <p className="font-bold text-gray-800">{item.name}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currencySymbol}{item.value.toLocaleString('es-ES')}
          </p>
          <p className="text-sm text-gray-600 mt-1">{item.percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({ percentage }: any) => {
    const perc = parseFloat(percentage);
    return perc >= 5 ? `${perc}%` : null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-8">Distribución de Gastos</h3>

      <ResponsiveContainer width="100%" height={420}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={60}
            formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Lista detallada */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">
                {currencySymbol}{item.value.toLocaleString('es-ES')} ({item.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}