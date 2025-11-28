import api from "./api";

// Obtener todas las categorías
export const obtenerCategorias = async () => {
  try {
    const res = await api.get("/categorias");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategorias error:", err);
    throw err;
  }
};

// Obtener categorías de gastos
export const obtenerCategoriasGastos = async () => {
  try {
    const res = await api.get("/categorias/gastos");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategoriasGastos error:", err);
    throw err;
  }
};

// Obtener categorías de ingresos
export const obtenerCategoriasIngresos = async () => {
  try {
    const res = await api.get("/categorias/ingresos");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerCategoriasIngresos error:", err);
    throw err;
  }
};
