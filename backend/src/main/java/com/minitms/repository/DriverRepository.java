package com.minitms.repository;

import com.minitms.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    List<Driver> findByLastNameContainingIgnoreCase(String lastName);
    
    // ¡¡CORRECTO!! Busca por campo "available"
    List<Driver> findByAvailableTrue();
    
    boolean existsByEmail(String email);
    
    Driver findByLicenseNumber(String licenseNumber);
    
    // ¡¡CORRECTO!! Cuenta por campo "available"
    long countByAvailableTrue();
}