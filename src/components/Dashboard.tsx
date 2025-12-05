import { Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export function Dashboard({ transactions, balance, totalIncome, totalExpense }: DashboardProps) {
  // Gastos por categoría
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: getCategoryLabel(name),
    value: Number(value.toFixed(2)),
  }));

  // Ingresos por categoría
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeCategoryData = Object.entries(incomeByCategory).map(([name, value]) => ({
    name: getCategoryLabel(name),
    value: Number(value.toFixed(2)),
  }));

  // Transacciones por mes (últimos 6 meses)
  const monthlyData = getMonthlyData(transactions);

  // Gastos recurrentes
  const recurringExpenses = transactions.filter(t => t.type === 'expense' && t.isRecurring);
  const recurringTotal = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);

  const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
              <Wallet className="size-4" />
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
              <TrendingUp className="size-4" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-emerald-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">
              {transactions.filter(t => t.type === 'income').length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
              <TrendingDown className="size-4" />
              Gastos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">${totalExpense.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">
              {transactions.filter(t => t.type === 'expense').length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
              <Activity className="size-4" />
              Gastos Recurrentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">${recurringTotal.toFixed(2)}/mes</div>
            <p className="text-xs text-gray-600 mt-1">
              {recurringExpenses.length} gastos fijos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de línea mensual */}
        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Flujo de caja mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="month" stroke="#059669" />
                <YAxis stroke="#059669" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Gastos"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de gastos por categoría */}
        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay gastos registrados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de ingresos por categoría */}
        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Ingresos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="name" stroke="#059669" />
                  <YAxis stroke="#059669" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
                  />
                  <Bar dataKey="value" fill="#10b981" name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay ingresos registrados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparación métodos de pago */}
        <Card className="bg-white/80 backdrop-blur border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Gastos por método de pago</CardTitle>
          </CardHeader>
          <CardContent>
            {getPaymentMethodData(transactions).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getPaymentMethodData(transactions)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="name" stroke="#059669" />
                  <YAxis stroke="#059669" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
                  />
                  <Bar dataKey="value" fill="#14b8a6" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay gastos registrados
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    food: 'Comida',
    transport: 'Transporte',
    entertainment: 'Entretenimiento',
    health: 'Salud',
    education: 'Educación',
    housing: 'Vivienda',
    utilities: 'Servicios',
    shopping: 'Compras',
    salary: 'Salario',
    freelance: 'Freelance',
    sales: 'Ventas',
    investment: 'Inversión',
    other: 'Otros',
  };
  return labels[category] || category;
}

function getMonthlyData(transactions: Transaction[]) {
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { income: 0, expense: 0 });
    }

    const data = monthlyMap.get(monthKey)!;
    if (t.type === 'income') {
      data.income += t.amount;
    } else {
      data.expense += t.amount;
    }
  });

  return Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, data]) => ({
      month: formatMonth(month),
      income: Number(data.income.toFixed(2)),
      expense: Number(data.expense.toFixed(2)),
      balance: Number((data.income - data.expense).toFixed(2)),
    }));
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

function getPaymentMethodData(transactions: Transaction[]) {
  const methodMap = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const labels: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    other: 'Otros',
  };

  return Object.entries(methodMap).map(([method, value]) => ({
    name: labels[method] || method,
    value: Number(value.toFixed(2)),
  }));
}
