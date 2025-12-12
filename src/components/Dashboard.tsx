// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { LogOut, TrendingUp, AlertCircle } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { TransactionForm } from './TransactionForm';
import { IncomeForm } from './IncomeForm';
import { TransactionList } from './TransactionList';
import { CashFlowProjection } from './CashFlowProjection';
import { FinancialPatterns } from './FinancialPatterns';
import { ChartSection } from './ChartSection';
import { getDashboardStats, getPredicciones, getGastosPorCategoria } from '../services/dashboardService';
import { listarTransacciones } from '../services/transaccionesService';

interface DashboardData {
  saldo_actual: number;
  total_ingresos: number;
  total_gastos: number;
  gastos_recurrentes: number;
  transacciones_count: number;
}

interface Prediccion {
  mes: string;
  saldo_proyectado: number;
  ingreso_estimado: number;
  gasto_estimado: number;
  confianza: string;
}

interface GastoCategoria {
  categoria: string;
  icono: string;
  color: string;
  monto: number;
  porcentaje: number;
  transacciones: number;
}

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'projections' | 'patterns'>('overview');

  const [stats, setStats] = useState<DashboardData | null>(null);
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [gastosCategoria, setGastosCategoria] = useState<GastoCategoria[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos del usuario desde localStorage
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const userData = users[userEmail];
  const currencySymbol = userData?.currency?.symbol || '$';

  // Cargar todos los datos del backend al montar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [statsRes, predRes, gastosRes, transRes] = await Promise.all([
          getDashboardStats(),
          getPredicciones(),
          getGastosPorCategoria(),
          listarTransacciones()
        ]);

        setStats(statsRes);
        setPredicciones(predRes);
        setGastosCategoria(gastosRes);

        // ¡IMPORTANTE!
        // FinancialPatterns necesita TODAS las transacciones (gastos + ingresos)
        // para calcular correctamente:
        // - métodos de pago más usados
        // - tasa de ahorro
        // - recurrentes, etc.
        setTransactions(transRes); // ← Todas las transacciones aquí

        // Incomes separados (por si otros componentes lo usan específicamente)
        setIncomes(transRes.filter(t => t.type === 'income'));

      } catch (err) {
        console.error('Error cargando dashboard:', err);
        setError('No se pudieron cargar los datos del servidor');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error de conexión</h3>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <nav className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">CoinControl</h1>
                <p className="text-gray-600">¡Hola, {userData?.name || userEmail}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 border-b border-emerald-200">
            {(['overview', 'transactions', 'projections', 'patterns'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-b-4 border-emerald-600 text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {tab === 'overview' ? 'Resumen' :
                 tab === 'transactions' ? 'Transacciones' :
                 tab === 'projections' ? 'Proyecciones' : 'Patrones'}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <BalanceCard
              totalIncome={stats.total_ingresos}
              totalExpenses={stats.total_gastos}
              balance={stats.saldo_actual}
              currencySymbol={currencySymbol}
              recurrentExpenses={stats.gastos_recurrentes}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionForm currencySymbol={currencySymbol} />
              <IncomeForm currencySymbol={currencySymbol} />
            </div>

            <ChartSection gastosPorCategoria={gastosCategoria} currencySymbol={currencySymbol} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList currencySymbol={currencySymbol} />
        )}

        {activeTab === 'projections' && (
          <CashFlowProjection predicciones={predicciones} currencySymbol={currencySymbol} />
        )}

        {activeTab === 'patterns' && (
          <FinancialPatterns
            transactions={transactions}
            incomes={incomes}
            currencySymbol={currencySymbol}
          />
        )}
      </div>
    </div>
  );
}