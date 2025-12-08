package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.LoginRequestDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.TokenRequestDTO;
import com.openclassrooms.etudiant.dto.UserResponseDTO;

import com.openclassrooms.etudiant.dto.UpdateUserDTO;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.mapper.UserDtoMapper;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.UserService;
import com.openclassrooms.etudiant.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDtoMapper userDtoMapper;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        try {
            userService.register(userDtoMapper.toEntity(registerDTO));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User created successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        String jwtToken = userService.login(loginRequestDTO.getLogin(), loginRequestDTO.getPassword());
        log.info("Token généré pour l'utilisateur : {}", loginRequestDTO.getLogin());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("username", loginRequestDTO.getLogin());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/validate-header")
    public ResponseEntity<?> validateFromHeader(@RequestHeader("Authorization") String authHeader) {
        try {
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

    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers()
                .stream()
                .map(u -> new UserResponseDTO(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getLogin(),
                        u.getCreated_at(),
                        u.getUpdated_at()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // Solution avec le repository
            if (id == null) {
                throw new IllegalArgumentException("L'id ne peut pas être null");
            }
            if (!userRepository.existsById(id)) {
                throw new IllegalArgumentException("Utilisateur introuvable");
            }
            userRepository.deleteById(id);
            log.info("Utilisateur avec id {} supprimé", id);

            return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO updateDTO) {
        try {
            return userRepository.findById(id)
                    .map(user -> {
                        // Mettre à jour les champs simples
                        user.setFirstName(updateDTO.getFirstName());
                        user.setLastName(updateDTO.getLastName());
                        user.setLogin(updateDTO.getLogin());

                        // Mettre à jour le mot de passe seulement s'il est fourni
                        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isEmpty()) {
                            // Créer un RegisterDTO avec les nouvelles infos pour encoder le mot de passe
                            RegisterDTO tempRegister = new RegisterDTO(
                                    updateDTO.getFirstName(),
                                    updateDTO.getLastName(),
                                    updateDTO.getLogin(),
                                    updateDTO.getPassword());
                            // Convertir en User avec ton mapper pour encoder le mot de passe
                            User tempUser = userDtoMapper.toEntity(tempRegister);
                            user.setPassword(tempUser.getPassword());
                        }

                        userRepository.save(user);
                        log.info("Utilisateur avec id {} modifié", id);

                        return ResponseEntity.ok(Map.of("message", "Utilisateur modifié avec succès"));
                    })
                    .orElseGet(() -> ResponseEntity.badRequest()
                            .body(Map.of("error", "Utilisateur introuvable")));
        } catch (Exception e) {
            log.error("Erreur lors de la modification de l'utilisateur {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la modification: " + e.getMessage()));
        }
    }

}