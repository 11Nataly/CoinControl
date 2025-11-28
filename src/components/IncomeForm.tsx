import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Income } from './Dashboard';

interface IncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  currencySymbol: string;
}

const INCOME_CATEGORIES = [
  'Sueldo',
  'Venta de producto',
  'Freelance',
  'Inversiones',
  'Alquiler',
  'Otros'
];

export function IncomeForm({ onAddIncome, currencySymbol }: IncomeFormProps) {
  const [category, setCategory] = useState('Sueldo');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    onAddIncome({
      category,
      amount: parseFloat(amount),
      date,
      description,
      isRecurring
    });

    setAmount('');
    setDescription('');
    setIsRecurring(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <PlusCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-gray-800">Registrar Ingreso</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Monto ({currencySymbol})</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Salario mensual"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recurring-income"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="recurring-income" className="text-gray-700">
            Ingreso recurrente (se repite mensualmente)
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Agregar Ingreso
        </button>
      </form>
    </div>
  );
}
