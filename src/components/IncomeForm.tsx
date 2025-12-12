import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Income } from './Dashboard';
import { obtenerCategoriasIngresos } from '../services/categoriasService';
import { crearTransaccion, obtenerMetodosPago } from '../services/transaccionesService';

interface IncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  currencySymbol: string;
}

interface Category {
  id: number;
  nombre: string;
  tipo: string;
  icono?: string;
  color?: string;
}

export function IncomeForm({ onAddIncome, currencySymbol }: IncomeFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo');
  const [description, setDescription] = useState('');
  const [origen, setOrigen] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await obtenerCategoriasIngresos();
        setCategories(cats);
        
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id.toString());
        }

        const methodsData = await obtenerMetodosPago();
        const methods = Object.values(methodsData);
        setPaymentMethods(methods);
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

    if (!origen.trim()) {
      alert('Por favor ingresa el origen del ingreso');
      setLoading(false);
      return;
    }

    if (!selectedCategory) {
      alert('Por favor selecciona una categoría');
      setLoading(false);
      return;
    }

    // Preparar DTO para INGRESO
    const dto = {
  categoria_id: parseInt(selectedCategory),
  monto: parseFloat(amount),
  descripcion: description.trim() || "",
  origen: origen.trim(),          // Campo obligatorio para ingresos
  destino: "",                    // Enviar string vacío en lugar de null
  metodo_pago: selectedPaymentMethod,
  fecha: date,
  es_recurrente: isRecurring,
  dia_recurrente: isRecurring ? new Date(date).getDate() : null,
};

    console.log('Enviando DTO de ingreso:', dto); // Para debug

    try {
      const response = await crearTransaccion(dto);
      console.log('Ingreso creado:', response);

      // Construir objeto para onAddIncome
      const cat = categories.find((c) => c.id === parseInt(selectedCategory));
      onAddIncome({
        category: cat ? cat.nombre : '',
        amount: dto.monto,
        date: dto.fecha,
        description: dto.descripcion || '',
        isRecurring: dto.es_recurrente,
      });

      // Resetear campos
      setAmount('');
      setDescription('');
      setOrigen('');
      setIsRecurring(false);
      
      alert('¡Ingreso registrado exitosamente!');
    } catch (err: any) {
      console.error('Error al crear el ingreso:', err);
      if (err.response?.data?.detail) {
        alert(`Error: ${err.response.data.detail}`);
      } else if (err.response?.data) {
        alert(`Error: ${JSON.stringify(err.response.data)}`);
      } else {
        alert('Error al crear el ingreso. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <PlusCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Registrar Ingreso</h2>
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
                {cat.icono && <span className="mr-2">{cat.icono}</span>}
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
          <label className="block text-gray-700 mb-2">Origen *</label>
          <input
            type="text"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Empresa, Cliente, etc."
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
            placeholder="Ej: Salario mensual"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Método de recepción</label>
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
          disabled={loading}
          className={`w-full py-3 rounded-lg transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {loading ? 'Registrando...' : 'Agregar Ingreso'}
        </button>
      </form>
    </div>
  );
}