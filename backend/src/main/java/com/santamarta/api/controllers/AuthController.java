package com.santamarta.api.controllers;

import com.santamarta.api.config.JwtService;
import com.santamarta.api.models.User;
import com.santamarta.api.repositories.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.USER)
                .build();

        userRepository.save(user);

        // Auto-login after registration
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("fullName", user.getFullName());

        final String jwt = jwtService.generateToken(extraClaims, userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("fullName", user.getFullName());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("fullName", user.getFullName());

        final String jwt = jwtService.generateToken(extraClaims, userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("fullName", user.getFullName());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request, Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validate current password if password update is requested
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("La contraseña actual es incorrecta");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }

        userRepository.save(user);

        // Generate new token with updated information
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("fullName", user.getFullName());

        final String jwt = jwtService.generateToken(extraClaims, userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("fullName", user.getFullName());

        return ResponseEntity.ok(response);
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
    }

    @Data
    public static class ProfileUpdateRequest {
        private String fullName;
        private String currentPassword;
        private String newPassword;
    }
}
