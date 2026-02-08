import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getDashboardStats = async () => {
  const res = await axios.get(`${API_URL}/dashboard/stats`);
  return res.data.data;
};

export const getStockSummary = async () => {
  const res = await axios.get(`${API_URL}/equipment/status/stock-summary`);
  return res.data.data;
};

export const getLowStock = async () => {
  const res = await axios.get(`${API_URL}/equipment/status/low-stock`);
  return res.data.data;
};
