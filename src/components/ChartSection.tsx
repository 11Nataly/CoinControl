// src/components/ChartSection.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface GastoCategoria {
  categoria: string;
  monto: number;
  porcentaje: number;
  color: string;
  icono?: string;
}

interface ChartSectionProps {
  gastosPorCategoria: GastoCategoria[];
  currencySymbol?: string;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

export function ChartSection({ gastosPorCategoria = [], currencySymbol = '$' }: ChartSectionProps) {
  // Si no hay datos, mostramos mensaje bonito
  if (!gastosPorCategoria || gastosPorCategoria.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Distribución de Gastos</h3>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Aún no tienes gastos registrados</p>
          <p className="text-sm mt-2">Los gráficos aparecerán cuando agregues transacciones</p>
        </div>
      </div>
    );
  }

  // Datos listos para Recharts
  const data = gastosPorCategoria.map((item, index) => ({
    name: item.categoria,
    value: item.monto,
    color: item.color || COLORS[index % COLORS.length],
  }));

  const totalGastos = gastosPorCategoria.reduce((sum, g) => sum + g.monto, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-1 border-gray-200">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {currencySymbol}{payload[0].value.toLocaleString('es-ES')} ({((payload[0].value / totalGastos) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Distribución de Gastos</h3>
      
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, porcentaje }) => `${name} ${porcentaje}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-gray-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {gastosPorCategoria.map((gasto, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: gasto.color || COLORS[index] }} />
            <div>
              <p className="text-sm font-medium text-gray-800">{gasto.categoria}</p>
              <p className="text-xs text-gray-600">
                {currencySymbol}{gasto.monto.toLocaleString('es-ES')} ({gasto.porcentaje}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}