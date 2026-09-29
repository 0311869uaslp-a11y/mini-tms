import api from './api';

export const tripService = {
  getAllTrips: async () => {
    try {
      const response = await api.get('/trips');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error creating trip' 
      };
    }
  },

  updateTrip: async (id, tripData) => {
    try {
      const response = await api.put(`/trips/${id}`, tripData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteTrip: async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateTripStatus: async (id, status) => {
    try {
      const response = await api.patch(`/trips/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getTripById: async (id) => {
    try {
      const response = await api.get(`/trips/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};