// src/components/TransactionList.tsx
import React, { useState, useEffect } from 'react';
import { Trash2, TrendingUp, TrendingDown, Calendar, CreditCard, Repeat } from 'lucide-react';
import { listarTransacciones, eliminarTransaccion } from '../services/transaccionesService';

export function TransactionList({ currencySymbol = '$' }: { currencySymbol?: string }) {
  const [transacciones, setTransacciones] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const cargarTransacciones = async () => {
    try {
      const data = await listarTransacciones();
      setTransacciones(data);
    } catch (error) {
      console.error("Error cargando transacciones:", error);
      alert("No se pudieron cargar las transacciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTransacciones();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta transacción?")) return;
    
    try {
      await eliminarTransaccion(id);
      setTransacciones(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  // Mapeamos los datos del backend al formato que espera la vista
  const items = transacciones
    .map(t => ({
      id: t.id,
      type: t.categoria.tipo === 'ingreso' ? 'income' : 'expense',
      category: t.categoria.nombre,
      amount: t.monto,
      date: t.fecha,
      description: t.descripcion || t.origen || t.destino || 'Sin descripción',
      paymentMethod: 
        t.metodo_pago === 'efectivo' ? 'Efectivo' :
        t.metodo_pago === 'tarjeta' ? 'Tarjeta' :
        t.metodo_pago === 'transferencia' ? 'Transferencia' : 'Otro',
      isRecurring: t.es_recurrente
    }))
    .filter(item => filter === 'all' || item.type === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">Cargando transacciones...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Historial de Transacciones</h2>
        
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')}    className={`px-4 py-2 rounded-lg ${filter === 'all'    ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>Todas</button>
          <button onClick={() => setFilter('income')} className={`px-4 py-2 rounded-lg ${filter === 'income' ? 'bg-green-600 text-white'   : 'bg-gray-100'}`}>Ingresos</button>
          <button onClick={() => setFilter('expense')}className={`px-4 py-2 rounded-lg ${filter === 'expense'? 'bg-red-600 text-white'    : 'bg-gray-100'}`}>Gastos</button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hay transacciones aún</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-lg ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.type === 'income' ? <TrendingUp className="w-6 h-6 text-green-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.category}</span>
                    {item.isRecurring && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1">
                        <Repeat className="w-3 h-3" /> Recurrente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(item.date).toLocaleDateString('es-ES')}</span>
                    <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> {item.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toLocaleString('es-ES', {minimumFractionDigits: 2})}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="ml-4 p-2 hover:bg-red-50 rounded-lg text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}