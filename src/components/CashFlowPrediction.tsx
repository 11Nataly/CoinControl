import { Transaction, Prediction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CashFlowPredictionProps {
  transactions: Transaction[];
  balance: number;
}

export function CashFlowPrediction({ transactions, balance }: CashFlowPredictionProps) {
  const predictions = generatePredictions(transactions, balance);
  const recurringExpenses = transactions.filter(t => t.type === 'expense' && t.isRecurring);
  const patterns = detectPatterns(transactions);

  return (
    <div className="space-y-6">
      {/* Alertas y patrones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.hasNegativeBalance && (
          <Alert className="border-red-300 bg-red-50">
            <AlertTriangle className="size-4 text-red-600" />
            <AlertTitle className="text-red-800">Alerta de flujo negativo</AlertTitle>
            <AlertDescription className="text-red-700">
              Se predice un saldo negativo en los próximos meses. Considera reducir gastos.
            </AlertDescription>
          </Alert>
        )}

        {patterns.hasHighRecurringExpenses && (
          <Alert className="border-orange-300 bg-orange-50">
            <Info className="size-4 text-orange-600" />
            <AlertTitle className="text-orange-800">Gastos recurrentes altos</AlertTitle>
            <AlertDescription className="text-orange-700">
              Tus gastos fijos representan {patterns.recurringPercentage}% de tus ingresos mensuales promedio.
            </AlertDescription>
          </Alert>
        )}

        {!patterns.hasNegativeBalance && !patterns.hasHighRecurringExpenses && (
          <Alert className="border-emerald-300 bg-emerald-50">
            <CheckCircle className="size-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Flujo saludable</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Tu flujo de caja proyectado es positivo. ¡Buen trabajo!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Gráfico de predicción */}
      <Card className="bg-white/80 backdrop-blur border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Predicción de flujo de caja (próximos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={predictions}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis dataKey="month" stroke="#059669" />
              <YAxis stroke="#059669" />
              <Tooltip
                contentStyle={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="predictedBalance"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorBalance)"
                name="Balance Proyectado"
              />
              <Line
                type="monotone"
                dataKey="predictedIncome"
                stroke="#0ea5e9"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Ingresos Proyectados"
              />
              <Line
                type="monotone"
                dataKey="predictedExpense"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Gastos Proyectados"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.slice(0, 3).map((pred, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{pred.month}</span>
                  <Badge
                    variant="outline"
                    className={
                      pred.confidence === 'high'
                        ? 'border-emerald-600 text-emerald-700'
                        : pred.confidence === 'medium'
                        ? 'border-yellow-600 text-yellow-700'
                        : 'border-red-600 text-red-700'
                    }
                  >
                    {pred.confidence === 'high' ? 'Alta' : pred.confidence === 'medium' ? 'Media' : 'Baja'} confianza
                  </Badge>
                </div>
                <div className={`${pred.predictedBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${pred.predictedBalance.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Ingreso: ${pred.predictedIncome.toFixed(2)} | Gasto: ${pred.predictedExpense.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gastos recurrentes */}
      <Card className="bg-white/80 backdrop-blur border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Gastos Recurrentes Detectados</CardTitle>
        </CardHeader>
        <CardContent>
          {recurringExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay gastos recurrentes registrados
            </div>
          ) : (
            <div className="space-y-3">
              {recurringExpenses.map(expense => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getCategoryLabel(expense.category)}</span>
                      <Badge variant="outline" className="text-xs">
                        Día {expense.recurringDay} de cada mes
                      </Badge>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-600">{expense.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-red-600">${expense.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">/mes</div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800">Total mensual recurrente:</span>
                  <span className="text-emerald-600">
                    ${recurringExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights y recomendaciones */}
      <Card className="bg-white/80 backdrop-blur border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {generateRecommendations(transactions, predictions, patterns).map((rec, index) => (
            <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-blue-600 mt-0.5">
                {rec.type === 'positive' ? <CheckCircle className="size-5" /> : <Info className="size-5" />}
              </div>
              <div className="flex-1">
                <p className="text-blue-900">{rec.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function generatePredictions(transactions: Transaction[], currentBalance: number): Prediction[] {
  const now = new Date();
  const predictions: Prediction[] = [];
  
  // Calcular promedios de los últimos 3 meses
  const last3Months = transactions.filter(t => {
    const date = new Date(t.date);
    const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    return monthsAgo < 3;
  });

  const avgMonthlyIncome = last3Months
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const avgMonthlyExpense = last3Months
    .filter(t => t.type === 'expense' && !t.isRecurring)
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const recurringExpense = transactions
    .filter(t => t.type === 'expense' && t.isRecurring)
    .reduce((sum, t) => sum + t.amount, 0);

  let runningBalance = currentBalance;

  for (let i = 0; i < 6; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    const monthKey = futureDate.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });

    const predictedIncome = avgMonthlyIncome || 0;
    const predictedExpense = (avgMonthlyExpense || 0) + recurringExpense;
    
    runningBalance += predictedIncome - predictedExpense;

    const confidence: Prediction['confidence'] = 
      transactions.length < 5 ? 'low' :
      transactions.length < 15 ? 'medium' : 'high';

    predictions.push({
      month: monthKey.charAt(0).toUpperCase() + monthKey.slice(1),
      predictedIncome: Number(predictedIncome.toFixed(2)),
      predictedExpense: Number(predictedExpense.toFixed(2)),
      predictedBalance: Number(runningBalance.toFixed(2)),
      confidence,
    });
  }

  return predictions;
}

function detectPatterns(transactions: Transaction[]) {
  const last3Months = transactions.filter(t => {
    const now = new Date();
    const date = new Date(t.date);
    const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    return monthsAgo < 3;
  });

  const avgMonthlyIncome = last3Months
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const avgMonthlyExpense = last3Months
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const recurringExpense = transactions
    .filter(t => t.type === 'expense' && t.isRecurring)
    .reduce((sum, t) => sum + t.amount, 0);

  const hasNegativeBalance = avgMonthlyIncome < avgMonthlyExpense;
  const recurringPercentage = avgMonthlyIncome > 0 
    ? Math.round((recurringExpense / avgMonthlyIncome) * 100)
    : 0;
  const hasHighRecurringExpenses = recurringPercentage > 50;

  return {
    hasNegativeBalance,
    hasHighRecurringExpenses,
    recurringPercentage,
    avgMonthlyIncome,
    avgMonthlyExpense,
  };
}

function generateRecommendations(
  transactions: Transaction[],
  predictions: Prediction[],
  patterns: ReturnType<typeof detectPatterns>
) {
  const recommendations: { type: 'positive' | 'info'; message: string }[] = [];

  if (patterns.hasNegativeBalance) {
    recommendations.push({
      type: 'info',
      message: 'Tus gastos superan tus ingresos. Considera crear un presupuesto mensual y reducir gastos no esenciales.',
    });
  }

  if (patterns.hasHighRecurringExpenses) {
    recommendations.push({
      type: 'info',
      message: 'Tus gastos fijos son altos. Revisa suscripciones y servicios que no uses frecuentemente.',
    });
  }

  const recurringCount = transactions.filter(t => t.isRecurring).length;
  if (recurringCount > 0) {
    recommendations.push({
      type: 'positive',
      message: `Has identificado ${recurringCount} gasto(s) recurrente(s). Esto ayuda a predecir mejor tu flujo de caja.`,
    });
  }

  if (predictions[0]?.predictedBalance > patterns.avgMonthlyIncome * 2) {
    recommendations.push({
      type: 'positive',
      message: 'Tu balance proyectado es saludable. Considera invertir o ahorrar el excedente.',
    });
  }

  if (transactions.length < 10) {
    recommendations.push({
      type: 'info',
      message: 'Registra más transacciones para obtener predicciones más precisas. Las predicciones mejoran con más datos históricos.',
    });
  }

  const categoryCount = new Set(transactions.map(t => t.category)).size;
  if (categoryCount >= 5) {
    recommendations.push({
      type: 'positive',
      message: 'Estás categorizando bien tus gastos. Esto te permite identificar en qué áreas gastas más.',
    });
  }

  return recommendations;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    food: '🍔 Comida',
    transport: '🚗 Transporte',
    entertainment: '🎬 Entretenimiento',
    health: '⚕️ Salud',
    education: '📚 Educación',
    housing: '🏠 Vivienda',
    utilities: '💡 Servicios',
    shopping: '🛍️ Compras',
    other: '📦 Otros',
  };
  return labels[category] || category;
}
