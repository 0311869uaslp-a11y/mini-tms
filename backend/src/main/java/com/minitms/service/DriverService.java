package com.minitms.service;

import com.minitms.model.Driver;
import com.minitms.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DriverService {
    
    @Autowired
    private DriverRepository driverRepository;
    
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
    
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado con ID: " + id));
    }
    
    public Driver createDriver(Driver driver) {
        // Validar que el email no exista
        if (driverRepository.existsByEmail(driver.getEmail())) {
            throw new RuntimeException("Ya existe un conductor con el email: " + driver.getEmail());
        }
        return driverRepository.save(driver);
    }
    
    public Driver updateDriver(Long id, Driver driverDetails) {
        Driver driver = getDriverById(id);
        
        driver.setFirstName(driverDetails.getFirstName());
        driver.setLastName(driverDetails.getLastName());
        driver.setEmail(driverDetails.getEmail());
        driver.setPhone(driverDetails.getPhone());
        driver.setLicenseNumber(driverDetails.getLicenseNumber());
        driver.setAvailable(driverDetails.isAvailable());
        
        return driverRepository.save(driver);
    }
    
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }
    
    public List<Driver> searchDrivers(String keyword) {
        return driverRepository.findByLastNameContainingIgnoreCase(keyword);
    }
    
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue();
    }
}