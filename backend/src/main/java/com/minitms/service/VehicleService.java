package com.minitms.service;

import com.minitms.model.Vehicle;
import com.minitms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
    }
    
    public Vehicle createVehicle(Vehicle vehicle) {
        // Validar matrícula única
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new RuntimeException("Ya existe un vehículo con esa matrícula");
        }
        return vehicleRepository.save(vehicle);
    }
    
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        
        vehicle.setRegistrationNumber(vehicleDetails.getRegistrationNumber());
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setColor(vehicleDetails.getColor());
        vehicle.setCapacity(vehicleDetails.getCapacity());
        vehicle.setVehicleType(vehicleDetails.getVehicleType());
        vehicle.setAvailable(vehicleDetails.isAvailable());
        vehicle.setStatus(vehicleDetails.getStatus());
        
        return vehicleRepository.save(vehicle);
    }
    
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
    
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailableTrue();
    }
    
    public List<Vehicle> searchVehicles(String keyword) {
        return vehicleRepository.findByRegistrationNumberContainingIgnoreCaseOrBrandContainingIgnoreCase(
            keyword, keyword);
    }
}