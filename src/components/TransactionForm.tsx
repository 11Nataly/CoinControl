import React, { useState, useEffect } from 'react';
import { MinusCircle } from 'lucide-react';
import { Transaction } from './Dashboard';
import { obtenerCategoriasGastos } from '../services/categoriasService';
import { crearTransaccion, obtenerMetodosPago } from '../services/transaccionesService';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  currencySymbol: string;
}

interface Category {
  id: number;
  nombre: string;
  tipo: string;
}

export function TransactionForm({ onAddTransaction, currencySymbol }: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo');
  const [description, setDescription] = useState('');
  const [destino, setDestino] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías de GASTOS
        const cats = await obtenerCategoriasGastos();
        setCategories(cats);
        
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id.toString());
        }

        // Obtener métodos de pago
        const methodsData = await obtenerMetodosPago();
        const methods = Object.values(methodsData);
        setPaymentMethods(methods);
        
        if (methods.length > 0) {
          setSelectedPaymentMethod(methods[0]);
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
        alert('Error al cargar los datos. Por favor, recarga la página.');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa un monto válido');
      setLoading(false);
      return;
    }

    if (!destino) {
      alert('Por favor ingresa el destino');
      setLoading(false);
      return;
    }

    if (!selectedCategory) {
      alert('Por favor selecciona una categoría');
      setLoading(false);
      return;
    }

    // Preparar DTO para GASTO
    const dto = {
      categoria_id: parseInt(selectedCategory),
      monto: parseFloat(amount),
      descripcion: description || null,
      destino: destino,
      origen: null,  // Para gastos, origen es null
      metodo_pago: selectedPaymentMethod,
      fecha: date,
      es_recurrente: isRecurring,
      dia_recurrente: isRecurring ? new Date(date).getDate() : null,
    };

    try {
      const response = await crearTransaccion(dto);
      console.log('Gasto creado:', response);

      // Construir objeto para onAddTransaction
      const cat = categories.find((c) => c.id === parseInt(selectedCategory));
      onAddTransaction({
        type: 'expense',
        category: cat ? cat.nombre : '',
        amount: dto.monto,
        date: dto.fecha,
        paymentMethod: selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1),
        description: dto.descripcion || '',
        isRecurring: dto.es_recurrente,
      });

      // Resetear campos
      setAmount('');
      setDescription('');
      setDestino('');
      setIsRecurring(false);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id.toString());
      }
      
      alert('¡Gasto registrado exitosamente!');
    } catch (err: any) {
      console.error('Error al crear el gasto:', err);
      if (err.response?.data?.detail) {
        alert(`Error: ${err.response.data.detail}`);
      } else {
        alert('Error al crear el gasto. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-100 p-2 rounded-lg">
          <MinusCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Registrar Gasto</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Categoría *</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Monto ({currencySymbol}) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Fecha *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Método de pago</label>
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Destino *</label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Supermercado, Restaurante, etc."
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Compra de supermercado semanal"
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
          disabled={loading}
          className={`w-full py-3 rounded-lg transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white`}
        >
          {loading ? 'Registrando...' : 'Agregar Gasto'}
        </button>
      </form>
    </div>
  );
}