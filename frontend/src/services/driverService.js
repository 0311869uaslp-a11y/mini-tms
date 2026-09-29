import api from './api';

export const driverService = {
  getAllDrivers: async () => {
    try {
      const response = await api.get('/drivers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  searchDrivers: async (keyword) => {
    try {
      const response = await api.get(`/drivers/search?keyword=${encodeURIComponent(keyword)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createDriver: async (driverData) => {
    try {
      const response = await api.post('/drivers', driverData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear conductor' 
      };
    }
  },

  deleteDriver: async (id) => {
    try {
      await api.delete(`/drivers/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};