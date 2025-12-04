// src/components/TransactionForm.tsx

import React, { useState, useEffect } from 'react';
import { MinusCircle } from 'lucide-react';
import { Transaction } from './Dashboard';
import { obtenerCategoriasGastos } from "../services/categoriasService";

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  currencySymbol: string;
}

const PAYMENT_METHODS = [
  'Efectivo',
  'Tarjeta de débito',
  'Tarjeta de crédito',
  'Transferencia',
  'Otro'
];

export function TransactionForm({ onAddTransaction, currencySymbol }: TransactionFormProps) {
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // 🔥 Cargar categorías desde el backend
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategoriasGastos();
        setCategorias(data);

        // Establecer la primera como seleccionada por defecto
        if (data.length > 0) setCategory(data[0].nombre);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };

    cargarCategorias();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    onAddTransaction({
      type: 'expense',
      category,
      amount: parseFloat(amount),
      date,
      paymentMethod,
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
        <div className="bg-red-100 p-2 rounded-lg">
          <MinusCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-gray-800">Registrar Gasto</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 🔻 Select dinámico desde BD */}
        <div>
          <label className="block text-gray-700 mb-2">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {categorias.length === 0 ? (
              <option disabled>Cargando...</option>
            ) : (
              categorias.map(cat => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))
            )}
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
          <label className="block text-gray-700 mb-2">Método de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Compra de supermercado"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recurring-expense"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="recurring-expense" className="text-gray-700">
            Gasto recurrente (se repite mensualmente)
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Agregar Gasto
        </button>
      </form>
    </div>
  );
}
