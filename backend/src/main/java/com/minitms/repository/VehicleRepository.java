package com.minitms.repository;

import com.minitms.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    // ¡¡CORRECTO!! Busca por campo "available"
    List<Vehicle> findByAvailableTrue();
    
    List<Vehicle> findByRegistrationNumberContainingIgnoreCaseOrBrandContainingIgnoreCase(String regNum, String brand);
    
    boolean existsByRegistrationNumber(String registrationNumber);
    
    // ¡¡CORRECTO!! Cuenta por campo "available"
    long countByAvailableTrue();
}