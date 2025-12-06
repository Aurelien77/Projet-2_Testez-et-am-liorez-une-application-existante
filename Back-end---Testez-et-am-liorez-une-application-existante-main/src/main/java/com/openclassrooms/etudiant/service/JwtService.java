package com.openclassrooms.etudiant.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Service
public class JwtService {

    public String generateToken(UserDetails userDetails) {
        String payload = "user:" + userDetails.getUsername() + ";ts:" + Instant.now().getEpochSecond();
        return Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }
}
