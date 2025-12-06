// src/services/transaccionesService.js
import api from "./api";

// 🔹 Crear una transacción
export const crearTransaccion = async (dto) => {
  const usuario_id = localStorage.getItem("user_id");
  try {
    const res = await api.post("/transacciones/", dto, { params: { usuario_id } });
    return res.data;
  } catch (err) {
    console.error("[servicio] crearTransaccion error:", err);
    throw err;
  }
};

// 🔹 Listar transacciones por usuario
export const listarTransacciones = async () => {
  const usuario_id = localStorage.getItem("user_id");
  try {
    const res = await api.get("/transacciones/", { params: { usuario_id } });
    return res.data;
  } catch (err) {
    console.error("[servicio] listarTransacciones error:", err);
    throw err;
  }
};

// 🔹 Eliminar una transacción
export const eliminarTransaccion = async (transaccion_id) => {
  const usuario_id = localStorage.getItem("user_id");
  try {
    const res = await api.delete(`/transacciones/${transaccion_id}`, { params: { usuario_id } });
    return res.data;
  } catch (err) {
    console.error("[servicio] eliminarTransaccion error:", err);
    throw err;
  }
};

// 🔹 Obtener métodos de pago
export const obtenerMetodosPago = async () => {
  try {
    const res = await api.get("/transacciones/metodos-pago");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerMetodosPago error:", err);
    throw err;
  }
};