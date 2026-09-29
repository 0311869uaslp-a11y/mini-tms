package com.minitms.model;
import com.fasterxml.jackson.annotation.JsonIgnore; // ← ESTE IMPORT

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String startLocation;
    
    @Column(nullable = false)
    private String endLocation;
    
    private LocalDateTime scheduledStart;
    
    private LocalDateTime scheduledEnd;
    
    private LocalDateTime actualStart;
    
    private LocalDateTime actualEnd;
    
    @Column(nullable = false)
    private String status = "PROGRAMADO";
    
    private Double distance;
    
    private Double estimatedDuration;
    
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    
    private String cargoDescription;
    
    private Double cargoWeight;
    
    // Constructors
    public Trip() {
    }
    
    public Trip(Long id, String startLocation, String endLocation, LocalDateTime scheduledStart, LocalDateTime scheduledEnd, LocalDateTime actualStart, LocalDateTime actualEnd, String status, Double distance, Double estimatedDuration, Driver driver, Vehicle vehicle, String cargoDescription, Double cargoWeight) {
        this.id = id;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.scheduledStart = scheduledStart;
        this.scheduledEnd = scheduledEnd;
        this.actualStart = actualStart;
        this.actualEnd = actualEnd;
        this.status = status;
        this.distance = distance;
        this.estimatedDuration = estimatedDuration;
        this.driver = driver;
        this.vehicle = vehicle;
        this.cargoDescription = cargoDescription;
        this.cargoWeight = cargoWeight;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getStartLocation() {
        return startLocation;
    }
    
    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }
    
    public String getEndLocation() {
        return endLocation;
    }
    
    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }
    
    public LocalDateTime getScheduledStart() {
        return scheduledStart;
    }
    
    public void setScheduledStart(LocalDateTime scheduledStart) {
        this.scheduledStart = scheduledStart;
    }
    
    public LocalDateTime getScheduledEnd() {
        return scheduledEnd;
    }
    
    public void setScheduledEnd(LocalDateTime scheduledEnd) {
        this.scheduledEnd = scheduledEnd;
    }
    
    public LocalDateTime getActualStart() {
        return actualStart;
    }
    
    public void setActualStart(LocalDateTime actualStart) {
        this.actualStart = actualStart;
    }
    
    public LocalDateTime getActualEnd() {
        return actualEnd;
    }
    
    public void setActualEnd(LocalDateTime actualEnd) {
        this.actualEnd = actualEnd;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Double getDistance() {
        return distance;
    }
    
    public void setDistance(Double distance) {
        this.distance = distance;
    }
    
    public Double getEstimatedDuration() {
        return estimatedDuration;
    }
    
    public void setEstimatedDuration(Double estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
    
    public Driver getDriver() {
        return driver;
    }
    
    public void setDriver(Driver driver) {
        this.driver = driver;
    }
    
    public Vehicle getVehicle() {
        return vehicle;
    }
    
    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
    
    public String getCargoDescription() {
        return cargoDescription;
    }
    
    public void setCargoDescription(String cargoDescription) {
        this.cargoDescription = cargoDescription;
    }
    
    public Double getCargoWeight() {
        return cargoWeight;
    }
    
    public void setCargoWeight(Double cargoWeight) {
        this.cargoWeight = cargoWeight;
    }
    
    // Métodos de negocio
    public void startTrip() {
        this.status = "EN_CURSO";
        this.actualStart = LocalDateTime.now();
    }
    
    public void completeTrip() {
        this.status = "COMPLETADO";
        this.actualEnd = LocalDateTime.now();
    }
}