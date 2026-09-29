package com.minitms.model;
import com.fasterxml.jackson.annotation.JsonIgnore; // ← ESTE IMPORT

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "drivers")
public class Driver {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phone;
    
    private String licenseNumber;
    
    // ¡¡IMPORTANTE!! Cambiar isAvailable → available
    private boolean available = true;  // ← NOMBRE CORREGIDO
    
    @OneToMany(mappedBy = "driver")
    @JsonIgnore  // ← Ahora funcionará
    private List<Trip> trips;
    
    // Constructors
    public Driver() {
    }
    
    public Driver(Long id, String firstName, String lastName, String email, String phone, String licenseNumber, boolean available) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.available = available;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getLicenseNumber() {
        return licenseNumber;
    }
    
    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
    
    // ¡¡IMPORTANTE!! Método debe llamarse isAvailable()
    public boolean isAvailable() {
        return available;
    }
    
    // ¡¡IMPORTANTE!! Setter debe llamarse setAvailable()
    public void setAvailable(boolean available) {
        this.available = available;
    }
    
    public List<Trip> getTrips() {
        return trips;
    }
    
    public void setTrips(List<Trip> trips) {
        this.trips = trips;
    }
}