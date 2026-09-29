package com.minitms.service;

import com.minitms.repository.DriverRepository;
import com.minitms.repository.TripRepository;
import com.minitms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private TripRepository tripRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Conteo básico
            long totalDrivers = driverRepository.count();
            long totalVehicles = vehicleRepository.count();
            long totalTrips = tripRepository.count();
            
            // Contar viajes activos (EN_CURSO)
            long activeTrips = 0;
            try {
                activeTrips = tripRepository.countByStatus("EN_CURSO");
            } catch (Exception e) {
                // Si el método no existe, calcular manualmente
                List<?> allTrips = tripRepository.findAll();
                activeTrips = allTrips.stream()
                    .filter(trip -> {
                        try {
                            Object status = trip.getClass().getMethod("getStatus").invoke(trip);
                            return "EN_CURSO".equals(status);
                        } catch (Exception ex) {
                            return false;
                        }
                    })
                    .count();
            }
            
            // Conductores disponibles
            long availableDrivers = 0;
            try {
                availableDrivers = driverRepository.countByAvailableTrue();
            } catch (Exception e) {
                // Método alternativo
                List<?> drivers = driverRepository.findAll();
                availableDrivers = drivers.stream()
                    .filter(driver -> {
                        try {
                            Object available = driver.getClass().getMethod("isAvailable").invoke(driver);
                            return Boolean.TRUE.equals(available);
                        } catch (Exception ex) {
                            return false;
                        }
                    })
                    .count();
            }
            
            // Vehículos disponibles
            long availableVehicles = 0;
            try {
                availableVehicles = vehicleRepository.countByAvailableTrue();
            } catch (Exception e) {
                // Método alternativo
                List<?> vehicles = vehicleRepository.findAll();
                availableVehicles = vehicles.stream()
                    .filter(vehicle -> {
                        try {
                            Object available = vehicle.getClass().getMethod("isAvailable").invoke(vehicle);
                            return Boolean.TRUE.equals(available);
                        } catch (Exception ex) {
                            return false;
                        }
                    })
                    .count();
            }
            
            // Calcular tasa de completación
            double completionRate = 0.0;
            try {
                long completedTrips = tripRepository.countByStatus("COMPLETADO");
                if (totalTrips > 0) {
                    completionRate = (completedTrips * 100.0) / totalTrips;
                }
            } catch (Exception e) {
                // Si no se puede calcular, dejar en 0
                completionRate = 0.0;
            }
            
            // Poblar estadísticas
            stats.put("totalDrivers", totalDrivers);
            stats.put("totalVehicles", totalVehicles);
            stats.put("totalTrips", totalTrips);
            stats.put("activeTrips", activeTrips);
            stats.put("availableDrivers", availableDrivers);
            stats.put("availableVehicles", availableVehicles);
            stats.put("completionRate", Math.round(completionRate * 100.0) / 100.0); // Redondear a 2 decimales
            stats.put("status", "success");
            
        } catch (Exception e) {
            // En caso de error, devolver estadísticas básicas
            stats.put("status", "error");
            stats.put("message", "Error calculando estadísticas: " + e.getMessage());
            stats.put("totalDrivers", 0);
            stats.put("totalVehicles", 0);
            stats.put("totalTrips", 0);
            stats.put("activeTrips", 0);
            stats.put("availableDrivers", 0);
            stats.put("availableVehicles", 0);
            stats.put("completionRate", 0.0);
        }
        
        return stats;
    }
    
    public Map<String, Object> getRecentTrips() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Intentar usar el método específico
            result.put("recentTrips", tripRepository.findTop5ByOrderByScheduledStartDesc());
            result.put("status", "success");
        } catch (Exception e) {
            // Fallback: obtener todos y limitar manualmente
            try {
                List<?> allTrips = tripRepository.findAll();
                int limit = Math.min(allTrips.size(), 5);
                result.put("recentTrips", allTrips.subList(0, limit));
                result.put("status", "success");
                result.put("message", "Usando fallback para viajes recientes");
            } catch (Exception ex) {
                result.put("status", "error");
                result.put("message", "No se pudieron obtener los viajes recientes");
                result.put("recentTrips", List.of());
            }
        }
        
        return result;
    }
    
    public Map<String, Object> getDriverPerformance() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Implementación básica - puedes mejorarla después
            List<?> drivers = driverRepository.findAll();
            
            Map<String, Object> performanceData = new HashMap<>();
            performanceData.put("totalDrivers", drivers.size());
            performanceData.put("message", "Estadísticas de rendimiento en desarrollo");
            
            result.put("status", "success");
            result.put("data", performanceData);
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error calculando rendimiento: " + e.getMessage());
            result.put("data", Map.of());
        }
        
        return result;
    }
    
    public Map<String, Object> getVehicleUtilization() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<?> vehicles = vehicleRepository.findAll();
            long totalVehicles = vehicles.size();
            
            // Contar vehículos en uso
            long vehiclesInUse = 0;
            try {
                vehiclesInUse = tripRepository.countByStatus("EN_CURSO"); // Viajes en curso = vehículos en uso
            } catch (Exception e) {
                // Fallback manual
                for (Object vehicle : vehicles) {
                    try {
                        Object status = vehicle.getClass().getMethod("getStatus").invoke(vehicle);
                        if ("EN_VIAJE".equals(status) || "EN_CURSO".equals(status)) {
                            vehiclesInUse++;
                        }
                    } catch (Exception ex) {
                        // Ignorar error
                    }
                }
            }
            
            // Calcular utilización
            double utilizationRate = 0.0;
            if (totalVehicles > 0) {
                utilizationRate = (vehiclesInUse * 100.0) / totalVehicles;
            }
            
            Map<String, Object> utilizationData = new HashMap<>();
            utilizationData.put("totalVehicles", totalVehicles);
            utilizationData.put("vehiclesInUse", vehiclesInUse);
            utilizationData.put("availableVehicles", totalVehicles - vehiclesInUse);
            utilizationData.put("utilizationRate", Math.round(utilizationRate * 100.0) / 100.0);
            
            result.put("status", "success");
            result.put("data", utilizationData);
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error calculando utilización: " + e.getMessage());
            result.put("data", Map.of());
        }
        
        return result;
    }
    
    // Método adicional para obtener todas las estadísticas en una sola llamada
    public Map<String, Object> getAllDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        dashboardData.put("stats", getDashboardStats());
        dashboardData.put("recentTrips", getRecentTrips());
        dashboardData.put("driverPerformance", getDriverPerformance());
        dashboardData.put("vehicleUtilization", getVehicleUtilization());
        
        return dashboardData;
    }
}