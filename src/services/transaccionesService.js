// services/transaccionesService.js  ← así sí funciona aunque sea .js
import api from './api';

export const listarTransacciones = async () => {
  try {
    const res = await api.get("/transacciones/");
    return res.data;
  } catch (err) {
    console.error("[servicio] listarTransacciones error:", err.response?.data || err);
    throw err;
  }
};

export const crearTransaccion = async (dto) => {
  try {
    const res = await api.post("/transacciones/", dto);
    return res.data;
  } catch (err) {
    console.error("[servicio] crearTransaccion error:", err.response?.data || err);
    throw err;
  }
};

export const eliminarTransaccion = async (transaccion_id) => {
  try {
    const res = await api.delete(`/transacciones/${transaccion_id}`);
    return res.data;
  } catch (err) {
    console.error("[servicio] eliminarTransaccion error:", err.response?.data || err);
    throw err;
  }
};

export const obtenerMetodosPago = async () => {
  try {
    const res = await api.get("/transacciones/metodos-pago");
    return res.data;
  } catch (err) {
    console.error("[servicio] obtenerMetodosPago error:", err);
    throw err;
  }
};