
import api from './api';

export const testService = {
  
  testConnection: async () => {
    try {
      
      const response = await api.get('/dashboard/stats');
      return { 
        success: true, 
        data: response.data,
        message: 'Conexión exitosa con backend Spring Boot'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },

  
  testOtherEndpoints: async () => {
    const endpoints = [
      '/drivers',
      '/vehicles',
      '/trips',
      '/auth/test' 
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        results.push({
          endpoint,
          success: true,
          status: response.status
        });
      } catch (error) {
        results.push({
          endpoint,
          success: false,
          status: error.response?.status,
          error: error.message
        });
      }
    }
    
    return results;
  }
};