package com.minitms.service;

import com.minitms.model.Driver;
import com.minitms.model.Trip;
import com.minitms.model.Vehicle;
import com.minitms.repository.DriverRepository;
import com.minitms.repository.TripRepository;
import com.minitms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public List<Trip> getAllTrips(String status, Long driverId) {
        if (status != null && driverId != null) {
            return tripRepository.findByStatusAndDriverId(status, driverId);
        } else if (status != null) {
            return tripRepository.findByStatus(status);
        } else if (driverId != null) {
            return tripRepository.findByDriverId(driverId);
        } else {
            return tripRepository.findAll();
        }
    }
    
    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));
    }
    
    public Trip createTrip(Trip trip) {
        System.out.println("📥 === INICIANDO createTrip ===");
        System.out.println("📥 Trip recibido: " + trip);
        
        // DEBUG: Verificar qué viene en el trip
        System.out.println("🔍 Trip.getDriver(): " + trip.getDriver());
        System.out.println("🔍 Trip.getVehicle(): " + trip.getVehicle());
        
        // SOLUCIÓN: Crear variables finales para usar en lambdas
        final Long driverId;
        final Long vehicleId;
        
        // OPCIÓN 1: Intentar obtener IDs del objeto Driver/Vehicle
        if (trip.getDriver() != null) {
            driverId = trip.getDriver().getId();
            System.out.println("🆔 Driver ID from object: " + driverId);
        } else {
            driverId = null;
        }
        
        if (trip.getVehicle() != null) {
            vehicleId = trip.getVehicle().getId();
            System.out.println("🆔 Vehicle ID from object: " + vehicleId);
        } else {
            vehicleId = null;
        }
        
        // OPCIÓN 2: Si vienen nulos, podría venir en propiedades separadas
        // (Spring Boot a veces no mapea correctamente objetos anidados)
        if (driverId == null) {
            System.out.println("⚠️ Driver ID is null. Checking for alternative properties...");
            // Podrías agregar propiedades driverId y vehicleId en Trip si es necesario
        }
        
        // VALIDACIÓN CRÍTICA
        if (driverId == null || vehicleId == null) {
            System.out.println("❌ ERROR: Faltan IDs. driverId=" + driverId + ", vehicleId=" + vehicleId);
            System.out.println("❌ Trip completo recibido:");
            System.out.println("  - startLocation: " + trip.getStartLocation());
            System.out.println("  - endLocation: " + trip.getEndLocation());
            System.out.println("  - distance: " + trip.getDistance());
            System.out.println("  - driver object: " + trip.getDriver());
            System.out.println("  - vehicle object: " + trip.getVehicle());
            
            throw new IllegalArgumentException(
                "Se requieren conductor y vehículo. driverId=" + driverId + ", vehicleId=" + vehicleId
            );
        }
        
        // Buscar conductor y vehículo en la base de datos
        System.out.println("🔍 Buscando conductor con ID: " + driverId);
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> {
                    System.out.println("❌ Conductor no encontrado con ID: " + driverId);
                    return new RuntimeException("Conductor no encontrado con ID: " + driverId);
                });
        
        System.out.println("🔍 Buscando vehículo con ID: " + vehicleId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> {
                    System.out.println("❌ Vehículo no encontrado con ID: " + vehicleId);
                    return new RuntimeException("Vehículo no encontrado con ID: " + vehicleId);
                });
        
        System.out.println("✅ Conductor encontrado: " + driver.getFirstName() + " " + driver.getLastName());
        System.out.println("✅ Vehículo encontrado: " + vehicle.getRegistrationNumber());
        
        // Asignar conductor y vehículo al trip
        trip.setDriver(driver);
        trip.setVehicle(vehicle);
        
        // Establecer valores por defecto
        if (trip.getStatus() == null || trip.getStatus().isEmpty()) {
            trip.setStatus("PROGRAMADO");
        }
        
        if (trip.getScheduledStart() == null) {
            trip.setScheduledStart(LocalDateTime.now());
            System.out.println("⏰ scheduledStart establecido a: " + trip.getScheduledStart());
        }
        
        if (trip.getScheduledEnd() == null && trip.getEstimatedDuration() != null) {
            trip.setScheduledEnd(trip.getScheduledStart().plusHours(
                trip.getEstimatedDuration().longValue()
            ));
        }
        
        // Calcular duración estimada si no viene
        if (trip.getEstimatedDuration() == null && trip.getDistance() != null) {
            // Suponer 60 km/h promedio
            trip.setEstimatedDuration(trip.getDistance() / 60.0);
            System.out.println("⏱️ estimatedDuration calculado: " + trip.getEstimatedDuration() + " horas");
        }
        
        // Marcar conductor y vehículo como no disponibles
        driver.setAvailable(false);
        vehicle.setAvailable(false);
        vehicle.setStatus("EN_VIAJE");
        
        System.out.println("💾 Guardando cambios en conductor y vehículo...");
        driverRepository.save(driver);
        vehicleRepository.save(vehicle);
        
        System.out.println("💾 Guardando trip en base de datos...");
        Trip savedTrip = tripRepository.save(trip);
        System.out.println("✅ Trip guardado con ID: " + savedTrip.getId());
        System.out.println("🎉 === createTrip COMPLETADO ===\n");
        
        return savedTrip;
    }
    
    public Trip updateTrip(Long id, Trip tripDetails) {
        Trip trip = getTripById(id);
        
        trip.setStartLocation(tripDetails.getStartLocation());
        trip.setEndLocation(tripDetails.getEndLocation());
        trip.setScheduledStart(tripDetails.getScheduledStart());
        trip.setScheduledEnd(tripDetails.getScheduledEnd());
        trip.setDistance(tripDetails.getDistance());
        trip.setEstimatedDuration(tripDetails.getEstimatedDuration());
        trip.setCargoDescription(tripDetails.getCargoDescription());
        trip.setCargoWeight(tripDetails.getCargoWeight());
        
        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Long id) {
        Trip trip = getTripById(id);
        
        // Liberar conductor y vehículo
        Driver driver = trip.getDriver();
        Vehicle vehicle = trip.getVehicle();
        
        if (driver != null) {
            driver.setAvailable(true);
            driverRepository.save(driver);
        }
        
        if (vehicle != null) {
            vehicle.setAvailable(true);
            vehicle.setStatus("DISPONIBLE");
            vehicleRepository.save(vehicle);
        }
        
        tripRepository.delete(trip);
    }
    
    public Trip startTrip(Long id) {
        Trip trip = getTripById(id);
        trip.startTrip();
        return tripRepository.save(trip);
    }
    
    public Trip completeTrip(Long id) {
        Trip trip = getTripById(id);
        trip.completeTrip();
        
        // Liberar conductor y vehículo
        Driver driver = trip.getDriver();
        Vehicle vehicle = trip.getVehicle();
        
        driver.setAvailable(true);
        vehicle.setAvailable(true);
        vehicle.setStatus("DISPONIBLE");
        
        driverRepository.save(driver);
        vehicleRepository.save(vehicle);
        
        return tripRepository.save(trip);
    }
    
    public List<Trip> getTripsByDriver(Long driverId) {
        return tripRepository.findByDriverId(driverId);
    }
    
    public Map<String, Object> getMonthlyStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Usar las consultas del repositorio
        long totalTrips = tripRepository.count();  // Método heredado de JpaRepository
        int completedTrips = tripRepository.countCompletedTrips();
        int inProgressTrips = tripRepository.countInProgressTrips();
        
        stats.put("totalTrips", totalTrips);
        stats.put("completedTrips", completedTrips);
        stats.put("inProgressTrips", inProgressTrips);
        stats.put("completionRate", totalTrips > 0 ? (completedTrips * 100.0 / totalTrips) : 0);
        
        return stats;
    }
}