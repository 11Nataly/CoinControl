import api from './api';

// 🔹 Obtener categorías de GASTOS (solo tipo "gasto")
export const obtenerCategoriasGastos = async () => {
  try {
    const res = await api.get("/categorias/gastos");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategoriasGastos error:", err);
    throw err;
  }
};

// 🔹 Obtener categorías de INGRESOS (solo tipo "ingreso")
export const obtenerCategoriasIngresos = async () => {
  try {
    const res = await api.get("/categorias/ingresos");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategoriasIngresos error:", err);
    throw err;
  }
};

// 🔹 Obtener TODAS las categorías
export const obtenerTodasCategorias = async () => {
  try {
    const res = await api.get("/categorias/");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerTodasCategorias error:", err);
    throw err;
  }
};