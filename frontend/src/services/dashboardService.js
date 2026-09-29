import api from './api';

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getDriverPerformance: async () => {
    try {
      const response = await api.get('/dashboard/driver-performance');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getVehicleUtilization: async () => {
    try {
      const response = await api.get('/dashboard/vehicle-utilization');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};