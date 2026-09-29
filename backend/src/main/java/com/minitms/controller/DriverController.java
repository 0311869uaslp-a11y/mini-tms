package com.minitms.controller;

import com.minitms.model.Driver;
import com.minitms.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")  // Para conectar con React Native
public class DriverController {
    
    @Autowired
    private DriverService driverService;
    
    // GET: Obtener todos los conductores
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        List<Driver> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }
    
    // GET: Obtener conductor por ID
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        return ResponseEntity.ok(driver);
    }
    
    // POST: Crear nuevo conductor
    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        Driver newDriver = driverService.createDriver(driver);
        return new ResponseEntity<>(newDriver, HttpStatus.CREATED);
    }
    
    // PUT: Actualizar conductor
    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(
            @PathVariable Long id, 
            @RequestBody Driver driverDetails) {
        Driver updatedDriver = driverService.updateDriver(id, driverDetails);
        return ResponseEntity.ok(updatedDriver);
    }
    
    // DELETE: Eliminar conductor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }
    
    // GET: Buscar conductores por apellido
    @GetMapping("/search")
    public ResponseEntity<List<Driver>> searchDrivers(@RequestParam String keyword) {
        List<Driver> drivers = driverService.searchDrivers(keyword);
        return ResponseEntity.ok(drivers);
    }
    
    // GET: Conductores disponibles
    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        List<Driver> drivers = driverService.getAvailableDrivers();
        return ResponseEntity.ok(drivers);
    }
}