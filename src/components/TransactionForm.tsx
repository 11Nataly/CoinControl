// src/components/TransactionForm.tsx
import React, { useState, useEffect } from 'react';
import { MinusCircle } from 'lucide-react';
import { Transaction } from './Dashboard';

import {
  obtenerCategoriasGastos,
  obtenerCategoriasIngresos
} from "../services/categoriasService";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
}

const PAYMENT_METHODS = [
  'Efectivo',
  'Tarjeta de débito',
  'Tarjeta de crédito',
  'Transferencia',
  'Otro'
];

export function TransactionForm({ onAddTransaction, currencySymbol }: TransactionFormProps) {

  // 🔥 Categorías separadas por tipo
  const [categoriasGasto, setCategoriasGasto] = useState<{ id: number; nombre: string }[]>([]);
  const [categoriasIngreso, setCategoriasIngreso] = useState<{ id: number; nombre: string }[]>([]);

  // form states
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // 🚀 Cargar categorías desde backend
  useEffect(() => {
    const cargar = async () => {
      try {
        const gastos = await obtenerCategoriasGastos();
        const ingresos = await obtenerCategoriasIngresos();

        setCategoriasGasto(gastos);
        setCategoriasIngreso(ingresos);

        // Seleccionar una por defecto según el tipo
        if (type === 'expense' && gastos.length > 0) setCategory(gastos[0].nombre);
        if (type === 'income' && ingresos.length > 0) setCategory(ingresos[0].nombre);

      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };

    cargar();
  }, [type]);

  // enviar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Monto inválido");
      return;
    }

    onAddTransaction({
      type,
      category,
      amount: parseFloat(amount),
      date,
      paymentMethod,
      description,
      isRecurring: type === "expense" ? isRecurring : false
    });

    // Reset form
    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentMethod("cash");
    setDescription("");
    setIsRecurring(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      {/* 🔽 Selector para alternar formulario */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setType("expense")}
          className={`px-4 py-2 rounded-lg w-1/2 ${type === "expense" ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
          Gasto
        </button>

        <button
          onClick={() => setType("income")}
          className={`px-4 py-2 rounded-lg w-1/2 ${type === "income" ? "bg-emerald-500 text-white" : "bg-gray-200"}`}
        >
          Ingreso
        </button>
      </div>

      {/* Título dinámico sin cambiar estilo */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-100 p-2 rounded-lg">
          <MinusCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-gray-800">
          {type === "expense" ? "Registrar Gasto" : "Registrar Ingreso"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 🔥 SELECT dinámico de categorías */}
        <div>
          <label className="block text-gray-700 mb-2">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {(type === "expense" ? categoriasGasto : categoriasIngreso).map(cat => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Método de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ej: Pago mensual salario"
          />
        </div>

        {/* Solo aparece en gasto */}
        {type === "expense" && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <label className="text-gray-700">Gasto recurrente</label>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white ${
            type === "expense" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          Agregar {type === "expense" ? "Gasto" : "Ingreso"}
        </button>
      </form>
    </div>
  );
}
