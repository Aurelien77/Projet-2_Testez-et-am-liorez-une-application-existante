package com.openclassrooms.etudiant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterDTO {
    private String firstName;
    private String lastName;
    private String login;
    private String password;

    public RegisterDTO(String firstName, String lastName, String login, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.login = login;
        this.password = password;
    }
}
