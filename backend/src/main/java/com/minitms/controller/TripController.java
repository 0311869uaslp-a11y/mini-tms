package com.minitms.controller;

import com.minitms.model.Trip;
import com.minitms.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;  // Add this import
import java.util.HashMap;        // Add this import
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {
    
    @Autowired
    private TripService tripService;
    
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long driverId) {
        return ResponseEntity.ok(tripService.getAllTrips(status, driverId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }
    
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.createTrip(trip));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.updateTrip(id, trip));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
    
    // Driver actions
    @PostMapping("/{id}/start")
    public ResponseEntity<Trip> startTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.startTrip(id));
    }
    
    @PostMapping("/{id}/complete")
    public ResponseEntity<Trip> completeTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.completeTrip(id));
    }
    
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testCreateTrip(@RequestBody Map<String, Object> request) {
        System.out.println("🧪 TEST Endpoint called");
        System.out.println("🧪 Request body: " + request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Test endpoint working");
        response.put("receivedData", request);
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Trip>> getDriverTrips(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.getTripsByDriver(driverId));
    }
    
    @GetMapping("/stats/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyStats() {
        return ResponseEntity.ok(tripService.getMonthlyStats());
    }
}