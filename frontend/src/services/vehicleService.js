import api from './api';

export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  searchVehicles: async (keyword) => {
    try {
      const response = await api.get(`/vehicles/search?keyword=${encodeURIComponent(keyword)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error creating vehicle' 
      };
    }
  },

  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await api.put(`/vehicles/${id}`, vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteVehicle: async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};