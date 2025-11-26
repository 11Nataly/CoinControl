import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Transaction, TransactionType, PaymentMethod, ExpenseCategory, IncomeCategory } from '../types';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || parseFloat(amount) <= 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const recurringDay = isRecurring ? new Date(date).getDate() : undefined;

    onSubmit({
      type,
      category: category as ExpenseCategory | IncomeCategory,
      amount: parseFloat(amount),
      date,
      paymentMethod,
      description,
      isRecurring,
      recurringDay,
    });

    // Reset form
    setCategory('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
    setDescription('');
    setIsRecurring(false);
  };

  const expenseCategories: { value: ExpenseCategory; label: string }[] = [
    { value: 'food', label: '🍔 Comida' },
    { value: 'transport', label: '🚗 Transporte' },
    { value: 'entertainment', label: '🎬 Entretenimiento' },
    { value: 'health', label: '⚕️ Salud' },
    { value: 'education', label: '📚 Educación' },
    { value: 'housing', label: '🏠 Vivienda' },
    { value: 'utilities', label: '💡 Servicios' },
    { value: 'shopping', label: '🛍️ Compras' },
    { value: 'other', label: '📦 Otros' },
  ];

  const incomeCategories: { value: IncomeCategory; label: string }[] = [
    { value: 'salary', label: '💼 Salario' },
    { value: 'freelance', label: '💻 Freelance' },
    { value: 'sales', label: '💰 Venta de producto' },
    { value: 'investment', label: '📈 Inversión' },
    { value: 'other', label: '📦 Otros' },
  ];

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'cash', label: '💵 Efectivo' },
    { value: 'card', label: '💳 Tarjeta' },
    { value: 'transfer', label: '🏦 Transferencia' },
    { value: 'other', label: '📱 Otro' },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-800">Agregar Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={type} onValueChange={(v) => { setType(v as TransactionType); setCategory(''); }}>
            <TabsList className="grid w-full grid-cols-2 bg-emerald-100">
              <TabsTrigger value="expense" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Gasto
              </TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                Ingreso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expense" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-emerald-300 focus:ring-emerald-500">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-emerald-300 focus:ring-emerald-500">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="border-emerald-300 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-emerald-300 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de pago</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <SelectTrigger className="border-emerald-300 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade una nota (opcional)"
              className="border-emerald-300 focus:ring-emerald-500 resize-none"
              rows={3}
            />
          </div>

          {type === 'expense' && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="recurring" className="text-emerald-800">Gasto recurrente</Label>
                <p className="text-sm text-emerald-600">
                  Se repetirá cada mes en la misma fecha
                </p>
              </div>
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="size-4 mr-2" />
            Agregar {type === 'expense' ? 'Gasto' : 'Ingreso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
