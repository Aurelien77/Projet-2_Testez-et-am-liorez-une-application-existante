package com.openclassrooms.etudiant.config;

import com.openclassrooms.etudiant.service.JwtService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public JwtService jwtService() {
        JwtService jwtService = mock(JwtService.class);
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("fake-jwt-token-for-tests");
        return jwtService;
    }
}