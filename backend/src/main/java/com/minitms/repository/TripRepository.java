package com.minitms.repository;

import com.minitms.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    // Métodos que SÍ funcionan (siguen convenciones)
    List<Trip> findByStatus(String status);
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByStatusAndDriverId(String status, Long driverId);
    List<Trip> findTop5ByOrderByScheduledStartDesc();
    
    // Contar por estado
    int countByStatus(String status);
    
    // Para contar todos los viajes: usa @Query
    @Query("SELECT COUNT(t) FROM Trip t")
    int countAllTrips();
    
    // Otra opción: usar el método count() heredado de JpaRepository
    // long count(); <- Ya existe por defecto
    
    // Para estadísticas mensuales
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.status = 'COMPLETADO'")
    int countCompletedTrips();
    
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.status = 'EN_CURSO'")
    int countInProgressTrips();
}