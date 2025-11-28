import React from 'react';
import { TrendingUp, AlertTriangle, Calendar, Zap, Target } from 'lucide-react';
import { Transaction, Income } from './Dashboard';

interface FinancialPatternsProps {
  transactions: Transaction[];
  incomes: Income[];
  currencySymbol: string;
}

export function FinancialPatterns({ transactions, incomes, currencySymbol }: FinancialPatternsProps) {
  const last30Days = transactions.filter(t => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(t.date) >= thirtyDaysAgo && t.type === 'expense';
  });

  const last60To30Days = transactions.filter(t => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const tDate = new Date(t.date);
    return tDate >= sixtyDaysAgo && tDate < thirtyDaysAgo && t.type === 'expense';
  });

  const last30Total = last30Days.reduce((sum, t) => sum + t.amount, 0);
  const previous30Total = last60To30Days.reduce((sum, t) => sum + t.amount, 0);
  const spendingTrend = previous30Total > 0 
    ? ((last30Total - previous30Total) / previous30Total) * 100 
    : 0;

  const expensesByCategory = last30Days.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)[0];

  const dayOfWeekExpenses = last30Days.reduce((acc, t) => {
    const day = new Date(t.date).getDay();
    acc[day] = (acc[day] || 0) + t.amount;
    return acc;
  }, {} as Record<number, number>);

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const highestSpendingDay = Object.entries(dayOfWeekExpenses)
    .sort(([, a], [, b]) => b - a)[0];

  const recurringExpenses = transactions.filter(t => t.isRecurring && t.type === 'expense');
  const recurringIncomes = incomes.filter(i => i.isRecurring);

  const totalRecurringExpenses = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalRecurringIncomes = recurringIncomes.reduce((sum, i) => sum + i.amount, 0);

  const paymentMethodUsage = transactions.reduce((acc, t) => {
    if (t.paymentMethod) {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostUsedPaymentMethod = Object.entries(paymentMethodUsage)
    .sort(([, a], [, b]) => b - a)[0];

  const avgDailySpending = last30Total / 30;
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8" />
          <h2>Análisis de Patrones Financieros</h2>
        </div>
        <p className="text-emerald-50">
          Detectamos automáticamente patrones en tus hábitos financieros para ayudarte a tomar mejores decisiones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-gray-800">Tendencia de Gastos</h3>
          </div>
          <p className={`mb-2 ${spendingTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {spendingTrend > 0 ? '+' : ''}{spendingTrend.toFixed(1)}%
          </p>
          <p className="text-gray-600">
            {spendingTrend > 0 
              ? 'Tus gastos aumentaron respecto al mes anterior'
              : spendingTrend < 0
              ? 'Tus gastos disminuyeron respecto al mes anterior'
              : 'Tus gastos se mantienen estables'
            }
          </p>
        </div>

        {topCategory && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-gray-800">Categoría Principal</h3>
            </div>
            <p className="text-blue-600 mb-2">{topCategory[0]}</p>
            <p className="text-gray-600">
              {currencySymbol}{topCategory[1].toLocaleString('es-ES', { minimumFractionDigits: 2 })} en los últimos 30 días
            </p>
            <p className="text-gray-500 mt-2">
              {((topCategory[1] / last30Total) * 100).toFixed(1)}% de tus gastos totales
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-gray-800">Gasto Diario Promedio</h3>
          </div>
          <p className="text-purple-600 mb-2">
            {currencySymbol}{avgDailySpending.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-600">
            Basado en tus últimos 30 días de actividad
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-gray-800">Tasa de Ahorro</h3>
          </div>
          <p className={`mb-2 ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-gray-600">
            {savingsRate >= 20 
              ? '¡Excelente! Estás ahorrando bien'
              : savingsRate >= 10
              ? 'Buen ahorro, puedes mejorar'
              : savingsRate > 0
              ? 'Intenta aumentar tu tasa de ahorro'
              : 'Estás gastando más de lo que ingresas'
            }
          </p>
        </div>

        {highestSpendingDay && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-gray-800">Día de Mayor Gasto</h3>
            </div>
            <p className="text-orange-600 mb-2">{days[parseInt(highestSpendingDay[0])]}</p>
            <p className="text-gray-600">
              Gastas más los días {days[parseInt(highestSpendingDay[0])].toLowerCase()}
            </p>
          </div>
        )}

        {mostUsedPaymentMethod && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-gray-800">Método Más Usado</h3>
            </div>
            <p className="text-pink-600 mb-2">{mostUsedPaymentMethod[0]}</p>
            <p className="text-gray-600">
              Usado en {mostUsedPaymentMethod[1]} transacciones
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 mb-4">Gastos e Ingresos Recurrentes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-red-100 p-2 rounded">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <h4 className="text-gray-700">Gastos Recurrentes</h4>
            </div>
            
            {recurringExpenses.length === 0 ? (
              <p className="text-gray-500">No tienes gastos recurrentes registrados</p>
            ) : (
              <div className="space-y-2">
                {recurringExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-gray-800">{expense.category}</p>
                      <p className="text-gray-600">{expense.description}</p>
                    </div>
                    <p className="text-red-600">
                      {currencySymbol}{expense.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <p className="text-gray-700">Total Mensual</p>
                  <p className="text-red-700">
                    {currencySymbol}{totalRecurringExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-green-100 p-2 rounded">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="text-gray-700">Ingresos Recurrentes</h4>
            </div>
            
            {recurringIncomes.length === 0 ? (
              <p className="text-gray-500">No tienes ingresos recurrentes registrados</p>
            ) : (
              <div className="space-y-2">
                {recurringIncomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-gray-800">{income.category}</p>
                      <p className="text-gray-600">{income.description}</p>
                    </div>
                    <p className="text-green-600">
                      {currencySymbol}{income.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
                <div className="mt-3 p-3 bg-green-100 rounded-lg">
                  <p className="text-gray-700">Total Mensual</p>
                  <p className="text-green-700">
                    {currencySymbol}{totalRecurringIncomes.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 mb-4">Recomendaciones Basadas en tus Patrones</h3>
        <div className="space-y-3">
          {spendingTrend > 10 && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-yellow-800">Tus gastos han aumentado significativamente</p>
                <p className="text-yellow-700 mt-1">
                  Considera revisar la categoría "{topCategory?.[0]}" donde más gastas
                </p>
              </div>
            </div>
          )}

          {savingsRate < 10 && totalIncome > 0 && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-red-800">Tu tasa de ahorro es baja</p>
                <p className="text-red-700 mt-1">
                  Intenta reducir gastos o buscar fuentes adicionales de ingreso para mejorar tu situación financiera
                </p>
              </div>
            </div>
          )}

          {savingsRate >= 20 && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-green-800">¡Excelente manejo financiero!</p>
                <p className="text-green-700 mt-1">
                  Estás ahorrando más del 20% de tus ingresos. Sigue así y considera invertir tus ahorros
                </p>
              </div>
            </div>
          )}

          {recurringExpenses.length === 0 && transactions.length > 5 && (
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-800">Marca tus gastos recurrentes</p>
                <p className="text-blue-700 mt-1">
                  Identificar gastos como suscripciones o servicios mensuales te ayudará a obtener mejores proyecciones
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
