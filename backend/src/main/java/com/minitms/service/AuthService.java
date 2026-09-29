package com.minitms.service;

import com.minitms.model.User;
import com.minitms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> login(String username, String password) {
        // SIMULACIÓN - En realidad deberías usar Spring Security
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        Map<String, Object> response = new HashMap<>();
        
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            response.put("success", true);
            response.put("token", "jwt-token-simulado-" + user.getId());
            response.put("user", user);
        } else {
            response.put("success", false);
            response.put("message", "Credenciales incorrectas");
        }
        
        return response;
    }
    
    public User register(User user) {
        // Validar que el usuario no exista
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }
        return userRepository.save(user);
    }
    
    public User getUserFromToken(String token) {
        // SIMULACIÓN - Extraer ID del token
        String idStr = token.replace("jwt-token-simulado-", "");
        Long userId = Long.parseLong(idStr);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}