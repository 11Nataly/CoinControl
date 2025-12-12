import api from './api'; 

// 🔹 Obtener categorías de GASTOS desde el endpoint específico
export const obtenerCategoriasGastos = async () => {
  try {
    const res = await api.get("/categorias/gastos");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategoriasGastos error:", err);
    throw err;
  }
};

// 🔹 Obtener categorías de INGRESOS desde el endpoint específico
export const obtenerCategoriasIngresos = async () => {
  try {
    const res = await api.get("/categorias/ingresos");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategoriasIngresos error:", err);
    throw err;
  }
};