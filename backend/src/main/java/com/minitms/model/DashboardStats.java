package com.minitms.model;

public class DashboardStats {
    
    private long totalDrivers;
    private long totalVehicles;
    private long totalTrips;
    private long activeTrips;
    private long availableDrivers;
    private long availableVehicles;
    private double completionRate;
    
    // Constructor
    public DashboardStats() {
    }
    
    public DashboardStats(long totalDrivers, long totalVehicles, long totalTrips, long activeTrips, long availableDrivers, long availableVehicles, double completionRate) {
        this.totalDrivers = totalDrivers;
        this.totalVehicles = totalVehicles;
        this.totalTrips = totalTrips;
        this.activeTrips = activeTrips;
        this.availableDrivers = availableDrivers;
        this.availableVehicles = availableVehicles;
        this.completionRate = completionRate;
    }
    
    // Getters and Setters
    public long getTotalDrivers() {
        return totalDrivers;
    }
    
    public void setTotalDrivers(long totalDrivers) {
        this.totalDrivers = totalDrivers;
    }
    
    public long getTotalVehicles() {
        return totalVehicles;
    }
    
    public void setTotalVehicles(long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }
    
    public long getTotalTrips() {
        return totalTrips;
    }
    
    public void setTotalTrips(long totalTrips) {
        this.totalTrips = totalTrips;
    }
    
    public long getActiveTrips() {
        return activeTrips;
    }
    
    public void setActiveTrips(long activeTrips) {
        this.activeTrips = activeTrips;
    }
    
    public long getAvailableDrivers() {
        return availableDrivers;
    }
    
    public void setAvailableDrivers(long availableDrivers) {
        this.availableDrivers = availableDrivers;
    }
    
    public long getAvailableVehicles() {
        return availableVehicles;
    }
    
    public void setAvailableVehicles(long availableVehicles) {
        this.availableVehicles = availableVehicles;
    }
    
    public double getCompletionRate() {
        return completionRate;
    }
    
    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }
}