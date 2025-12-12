// src/services/dashboardService.ts
import api from './api';

export const getDashboardStats = async () => {
  try {
    const res = await api.get('/dashboard/stats');
    return res.data;
  } catch (error: any) {
    console.error('Error cargando stats:', error.response?.data || error);
    throw error;
  }
};

export const getPredicciones = async () => {
  try {
    const res = await api.get('/dashboard/predicciones');
    return res.data;
  } catch (error: any) {
    console.error('Error cargando predicciones:', error);
    throw error;
  }
};

export const getGastosPorCategoria = async () => {
  try {
    const res = await api.get('/dashboard/gastos-categoria');
    return res.data;
  } catch (error: any) {
    console.error('Error cargando gastos por categoría:', error);
    throw error;
  }
};