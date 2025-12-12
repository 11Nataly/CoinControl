// src/components/FinancialPatterns.tsx
import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Zap, 
  Target, 
  Info, 
  Repeat,
  CreditCard 
} from 'lucide-react';

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

interface FinancialPatternsProps {
  transactions: RawTransaction[];
  incomes: RawTransaction[];
  currencySymbol: string;
}

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function FinancialPatterns({ transactions, currencySymbol }: FinancialPatternsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtrar solo transacciones pasadas o de hoy (para análisis históricos)
  const pastTransactions = transactions.filter(t => new Date(t.fecha) <= today);

  // Separar ingresos y gastos históricos
  const expenses = pastTransactions.filter(t => t.categoria.tipo === 'gasto');
  const pastIncomes = pastTransactions.filter(t => t.categoria.tipo === 'ingreso');

  // Últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const last30Expenses = expenses.filter(t => new Date(t.fecha) >= thirtyDaysAgo);

  // Período anterior (31-60 días atrás)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  sixtyDaysAgo.setHours(0, 0, 0, 0);

  const previous30Expenses = expenses.filter(t => {
    const d = new Date(t.fecha);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  });

  const last30Total = last30Expenses.reduce((sum, t) => sum + t.monto, 0);
  const previous30Total = previous30Expenses.reduce((sum, t) => sum + t.monto, 0);

  const spendingTrend = previous30Total > 0
    ? ((last30Total - previous30Total) / previous30Total) * 100
    : last30Total > 0 ? 100 : 0;

  // Categoría principal (últimos 30 días)
  const expensesByCategory = last30Expenses.reduce((acc, t) => {
    const catName = t.categoria.nombre;
    acc[catName] = (acc[catName] || 0) + t.monto;
    return acc;
  }, {} as Record<string, number>);

  const topCategoryEntry = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)[0];

  // Día de la semana con más gasto
  const dayExpenses = last30Expenses.reduce((acc, t) => {
    const day = new Date(t.fecha).getDay();
    acc[day] = (acc[day] || 0) + t.monto;
    return acc;
  }, {} as Record<number, number>);

  const highestDayEntry = Object.entries(dayExpenses)
    .sort(([,a], [,b]) => b - a)[0];

  // Método de pago más usado (solo transacciones pasadas)
  const paymentMethods = pastTransactions.reduce((acc, t) => {
    const method = t.metodo_pago === 'efectivo' ? 'Efectivo' :
                   t.metodo_pago === 'tarjeta' ? 'Tarjeta' :
                   t.metodo_pago === 'transferencia' ? 'Transferencia' : 'Otro';
    if (method) {
      acc[method] = (acc[method] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostUsedPaymentEntry = Object.entries(paymentMethods)
    .sort(([,a], [,b]) => b - a)[0];

  // === RECURRENTES: AHORA SIN FILTRO DE FECHA ===
  const recurringExpenses = transactions.filter(t => 
    t.es_recurrente && t.categoria.tipo === 'gasto'
  );

  const recurringIncomes = transactions.filter(t => 
    t.es_recurrente && t.categoria.tipo === 'ingreso'
  );

  const totalRecurringExpenses = recurringExpenses.reduce((sum, t) => sum + t.monto, 0);
  const totalRecurringIncomes = recurringIncomes.reduce((sum, t) => sum + t.monto, 0);

  // Tasa de ahorro (solo transacciones pasadas)
  const totalIncome = pastIncomes.reduce((sum, t) => sum + t.monto, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.monto, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Gasto diario promedio
  const daysWithActivity = new Set(last30Expenses.map(t => new Date(t.fecha).toDateString())).size;
  const avgDailySpending = daysWithActivity > 0 ? last30Total / daysWithActivity : last30Total / 30;

  const hasData = pastTransactions.length > 0;
  const hasRecentExpenses = last30Total > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Análisis de Patrones Financieros</h2>
        </div>
        <p className="text-emerald-50 text-lg">
          {hasData || recurringExpenses.length > 0 || recurringIncomes.length > 0
            ? "Aquí tienes un resumen inteligente de tus hábitos financieros basado en tus movimientos."
            : "Registra transacciones para comenzar a ver análisis útiles."}
        </p>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tendencia de Gastos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Tendencia de Gastos</h3>
          </div>
          <p className={`text-3xl font-bold ${spendingTrend > 0 ? 'text-red-600' : spendingTrend < 0 ? 'text-green-600' : 'text-gray-600'}`}>
            {spendingTrend > 0 ? '+' : ''}{spendingTrend.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {previous30Total === 0 ? "Primeros datos registrados" : spendingTrend > 0 ? "Aumento respecto al período anterior" : spendingTrend < 0 ? "¡Reducción excelente!" : "Gastos estables"}
          </p>
        </div>

        {/* Gasto Diario Promedio */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Gasto Diario Promedio</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {currencySymbol}{avgDailySpending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {hasRecentExpenses ? `En ${daysWithActivity} días activos` : "Aún sin gastos recientes"}
          </p>
        </div>

        {/* Tasa de Ahorro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-teal-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Tasa de Ahorro</h3>
          </div>
          <p className={`text-3xl font-bold ${savingsRate >= 20 ? 'text-green-600' : savingsRate > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {totalIncome === 0 ? "Registra ingresos para calcular" : savingsRate >= 20 ? "¡Excelente disciplina!" : savingsRate > 0 ? "Vas bien, ¡sigue así!" : "Estás gastando todo lo que ingresas"}
          </p>
        </div>

        {/* Categoría Principal */}
        {topCategoryEntry ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Categoría Principal</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{topCategoryEntry[0]}</p>
            <p className="text-xl text-gray-800">
              {currencySymbol}{topCategoryEntry[1].toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500">Últimos 30 días</p>
          </div>
        ) : hasRecentExpenses ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-dashed border-gray-300">
            <div className="text-center text-gray-500 py-8">
              <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Varias categorías equilibradas</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-dashed border-gray-300">
            <div className="text-center text-gray-500 py-8">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Sin gastos recientes</p>
            </div>
          </div>
        )}

        {/* Día de Mayor Gasto */}
        {highestDayEntry ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Día de Mayor Gasto</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {days[parseInt(highestDayEntry[0])]}
            </p>
            <p className="text-sm text-gray-600 mt-2">Planifica mejor ese día</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-dashed border-gray-300">
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aún no hay patrón detectable</p>
            </div>
          </div>
        )}

        {/* Método Más Usado */}
        {mostUsedPaymentEntry ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Método Más Usado</h3>
            </div>
            <p className="text-2xl font-bold text-pink-600">{mostUsedPaymentEntry[0]}</p>
            <p className="text-sm text-gray-600 mt-2">{mostUsedPaymentEntry[1]} transacciones</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-dashed border-gray-300">
            <div className="text-center text-gray-500 py-8">
              <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Registra más movimientos</p>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN DE GASTOS E INGRESOS RECURRENTES */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Gastos e Ingresos Recurrentes</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* GASTOS RECURRENTES */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Gastos Recurrentes</h4>
            </div>

            {recurringExpenses.length === 0 ? (
              <p className="text-gray-500 italic">No tienes gastos recurrentes registrados</p>
            ) : (
              <div className="space-y-3">
                {recurringExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{expense.categoria.nombre}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1">
                          <Repeat className="w-3 h-3" />
                          Recurrente
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {expense.descripcion || expense.destino || 'Sin descripción'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Próximo: {new Date(expense.fecha).toLocaleDateString('es-ES')}
                        </span>
                        {expense.metodo_pago && (
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {expense.metodo_pago === 'efectivo' ? 'Efectivo' :
                             expense.metodo_pago === 'tarjeta' ? 'Tarjeta' :
                             expense.metodo_pago === 'transferencia' ? 'Transferencia' : 'Otro'}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-lg font-bold text-red-600 ml-4">
                      -{currencySymbol}{expense.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-red-200">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Total mensual estimado</p>
                    <p className="text-xl font-bold text-red-700">
                      -{currencySymbol}{totalRecurringExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INGRESOS RECURRENTES */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Ingresos Recurrentes</h4>
            </div>

            {recurringIncomes.length === 0 ? (
              <p className="text-gray-500 italic">No tienes ingresos recurrentes registrados</p>
            ) : (
              <div className="space-y-3">
                {recurringIncomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{income.categoria.nombre}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1">
                          <Repeat className="w-3 h-3" />
                          Recurrente
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {income.descripcion || income.origen || 'Sin descripción'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Próximo: {new Date(income.fecha).toLocaleDateString('es-ES')}
                        </span>
                        {income.metodo_pago && (
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {income.metodo_pago === 'efectivo' ? 'Efectivo' :
                             income.metodo_pago === 'tarjeta' ? 'Tarjeta' :
                             income.metodo_pago === 'transferencia' ? 'Transferencia' : 'Otro'}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-lg font-bold text-green-600 ml-4">
                      +{currencySymbol}{income.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Total mensual estimado</p>
                    <p className="text-xl font-bold text-green-700">
                      +{currencySymbol}{totalRecurringIncomes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recomendaciones Personalizadas */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recomendaciones Personalizadas</h3>
        <div className="space-y-4">
          {totalRecurringExpenses > totalRecurringIncomes && (
            <div className="flex items-start space-x-4 p-5 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-red-800">Tus gastos recurrentes superan tus ingresos fijos</p>
                <p className="text-red-700 mt-1">Revisa suscripciones o servicios mensuales para equilibrar tu flujo.</p>
              </div>
            </div>
          )}

          {savingsRate < 10 && totalIncome > 0 && (
            <div className="flex items-start space-x-4 p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-yellow-800">Tu tasa de ahorro es baja</p>
                <p className="text-yellow-700 mt-1">Intenta reducir gastos variables o aumentar ingresos.</p>
              </div>
            </div>
          )}

          {(recurringExpenses.length > 0 || recurringIncomes.length > 0) && (
            <div className="flex items-start space-x-4 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-blue-800">
                  Tienes {recurringExpenses.length + recurringIncomes.length} movimiento(s) recurrente(s)
                </p>
                <p className="text-blue-700 mt-1">Esto nos ayudará a hacer proyecciones más precisas en el futuro.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}