package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private UserRole role;
    private long expiresIn;
    private String organizationId;
}
