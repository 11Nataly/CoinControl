// src/components/CashFlowProjection.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';

interface Prediccion {
  mes: string;
  saldo_proyectado: number;
  ingreso_estimado: number;
  gasto_estimado: number;
  confianza: string;
}

interface CashFlowProjectionProps {
  predicciones: Prediccion[];
  currencySymbol: string;
}

export function CashFlowProjection({ predicciones, currencySymbol }: CashFlowProjectionProps) {
  if (!predicciones || predicciones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No hay datos suficientes para generar proyecciones</p>
      </div>
    );
  }

  // Usar el primer mes como balance actual (asumiendo que viene del backend)
  const currentBalance = predicciones[0].saldo_proyectado;
  const sixMonthBalance = predicciones[predicciones.length - 1].saldo_proyectado;
  const isPositiveProjection = sixMonthBalance >= currentBalance;

  // Calcular promedios
  const avgIncome = predicciones.reduce((sum, p) => sum + p.ingreso_estimado, 0) / predicciones.length;
  const avgExpenses = predicciones.reduce((sum, p) => sum + p.gasto_estimado, 0) / predicciones.length;
  const avgSavings = avgIncome - avgExpenses;

  // Transformar datos para el gráfico
  const chartData = predicciones.map(p => ({
    month: p.mes,
    balance: parseFloat(p.saldo_proyectado.toFixed(2)),
    income: parseFloat(p.ingreso_estimado.toFixed(2)),
    expenses: parseFloat(p.gasto_estimado.toFixed(2))
  }));

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
            <p className={`text-2xl font-bold ${avgSavings >= 0 ? 'text-white' : 'text-red-200'}`}>
              {currencySymbol}{avgSavings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          <LineChart data={chartData}>
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
            {currencySymbol}{avgIncome.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Promedio basado en patrones históricos
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
            {currencySymbol}{avgExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Promedio basado en patrones históricos
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Proyección</h3>
        <div className="space-y-3">
          {chartData.map((data, index) => (
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