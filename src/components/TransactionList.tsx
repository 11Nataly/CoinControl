import { useState } from 'react';
import { Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Calendar, CreditCard, Repeat } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
}

export function TransactionList({ transactions, onDelete, onUpdate }: TransactionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const allCategories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <>
      <Card className="bg-white/80 backdrop-blur border-emerald-200">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-emerald-800">Historial de Transacciones</CardTitle>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                <SelectTrigger className="w-[140px] border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px] border-emerald-300">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay transacciones registradas
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={transaction.type === 'income' ? 'default' : 'destructive'}
                        className={transaction.type === 'income' ? 'bg-emerald-600' : 'bg-red-600'}
                      >
                        {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {getCategoryLabel(transaction.category)}
                      </span>
                      {transaction.isRecurring && (
                        <Badge variant="outline" className="gap-1 border-emerald-600 text-emerald-700">
                          <Repeat className="size-3" />
                          Recurrente
                        </Badge>
                      )}
                    </div>
                    
                    {transaction.description && (
                      <p className="text-sm text-gray-700 mb-2">{transaction.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="size-3" />
                        {getPaymentMethodLabel(transaction.paymentMethod)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div
                      className={`text-right ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(transaction.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la transacción permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
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
    salary: '💼 Salario',
    freelance: '💻 Freelance',
    sales: '💰 Ventas',
    investment: '📈 Inversión',
    other: '📦 Otros',
  };
  return labels[category] || category;
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    other: 'Otro',
  };
  return labels[method] || method;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}
