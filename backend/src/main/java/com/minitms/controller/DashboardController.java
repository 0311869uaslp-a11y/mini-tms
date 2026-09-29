package com.minitms.controller;

import com.minitms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
    
    @GetMapping("/recent-trips")
    public ResponseEntity<?> getRecentTrips() {
        return ResponseEntity.ok(dashboardService.getRecentTrips());
    }
    
    @GetMapping("/driver-performance")
    public ResponseEntity<?> getDriverPerformance() {
        return ResponseEntity.ok(dashboardService.getDriverPerformance());
    }
    
    @GetMapping("/vehicle-utilization")
    public ResponseEntity<?> getVehicleUtilization() {
        return ResponseEntity.ok(dashboardService.getVehicleUtilization());
    }
}