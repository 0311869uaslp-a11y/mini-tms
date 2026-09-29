package com.minitms.model;
import com.fasterxml.jackson.annotation.JsonIgnore; // ← IMPORT

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String registrationNumber;
    
    @Column(nullable = false)
    private String brand;
    
    @Column(nullable = false)
    private String model;
    
    @Column(name = "\"year\"")
    private Integer year;
    
    private String color;
    
    @Column(nullable = false)
    private Double capacity;
    
    private String vehicleType;
    
    // ¡¡IMPORTANTE!! Cambiar isAvailable → available
    private boolean available = true;  // ← NOMBRE CORREGIDO
    
    private String status = "DISPONIBLE";
    
    // Constructors
    public Vehicle() {
    }
    
    public Vehicle(Long id, String registrationNumber, String brand, String model, Integer year, String color, Double capacity, String vehicleType, boolean available, String status) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.color = color;
        this.capacity = capacity;
        this.vehicleType = vehicleType;
        this.available = available;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public Double getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Double capacity) {
        this.capacity = capacity;
    }
    
    public String getVehicleType() {
        return vehicleType;
    }
    
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    // ¡¡IMPORTANTE!! Método debe llamarse isAvailable()
    public boolean isAvailable() {
        return available;
    }
    
    // ¡¡IMPORTANTE!! Setter debe llamarse setAvailable()
    public void setAvailable(boolean available) {
        this.available = available;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}