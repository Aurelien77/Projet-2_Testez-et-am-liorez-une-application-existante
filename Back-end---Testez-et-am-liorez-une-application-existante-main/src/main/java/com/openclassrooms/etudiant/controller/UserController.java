package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.LoginRequestDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.TokenRequestDTO;
import com.openclassrooms.etudiant.mapper.UserDtoMapper;
import com.openclassrooms.etudiant.service.UserService;
import com.openclassrooms.etudiant.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDtoMapper userDtoMapper;
    private final JwtService jwtService;

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        userService.register(userDtoMapper.toEntity(registerDTO));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        String jwtToken = userService.login(loginRequestDTO.getLogin(), loginRequestDTO.getPassword());
        System.out.println("Token généré : " + jwtToken);

        // Retourner un objet JSON avec le token
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("username", loginRequestDTO.getLogin());

        return ResponseEntity.ok(response);
    }

    // valider le token
    @PostMapping("/api/validate")
    public ResponseEntity<?> validate(@RequestBody TokenRequestDTO tokenRequest) {
        try {
            boolean isValid = jwtService.validateToken(tokenRequest.getToken());

            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);

            if (isValid) {
                String username = jwtService.extractUsername(tokenRequest.getToken());
                response.put("username", username);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // Valider depuis le header
    @GetMapping("/api/validate-header")
    public ResponseEntity<?> validateFromHeader(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extraire le token du format "Bearer <token>"
            String token = authHeader.replace("Bearer ", "");
            boolean isValid = jwtService.validateToken(token);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);

            if (isValid) {
                String username = jwtService.extractUsername(token);
                response.put("username", username);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}