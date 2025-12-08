package com.openclassrooms.etudiant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateUserDTO {
    private String firstName;
    private String lastName;
    private String login;
    private String password; // facultatif si on ne veut pas changer
}
