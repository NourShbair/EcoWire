package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String userId;
    private String username;
    private String email;
    private UserRole role;
    private LocalDateTime createdDate;
}
