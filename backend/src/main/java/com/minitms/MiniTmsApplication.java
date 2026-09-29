package com.minitms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MiniTmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiniTmsApplication.class, args);
        System.out.println("=========================================");
        System.out.println("✅ MINI TMS BACKEND INICIADO CORRECTAMENTE");
        System.out.println("✅ Puerto: 8080");
        System.out.println("✅ URL Base: http://localhost:8080/api");
        System.out.println("=========================================");
        System.out.println();
        System.out.println("📋 ENDPOINTS DISPONIBLES:");
        System.out.println("  👤 Auth:      http://localhost:8080/api/auth");
        System.out.println("  🚗 Conductores: http://localhost:8080/api/drivers");
        System.out.println("  🚛 Vehículos:  http://localhost:8080/api/vehicles");
        System.out.println("  🗺️  Viajes:     http://localhost:8080/api/trips");
        System.out.println("  📊 Dashboard:  http://localhost:8080/api/dashboard");
        System.out.println("=========================================");
    }
}