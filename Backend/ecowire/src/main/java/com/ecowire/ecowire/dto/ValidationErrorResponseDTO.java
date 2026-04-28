package com.ecowire.ecowire.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class ValidationErrorResponseDTO extends ErrorResponseDTO {
    private List<FieldErrorDTO> errors;

    public ValidationErrorResponseDTO(LocalDateTime timestamp, int status,
                                      String error, String message,
                                      String path, List<FieldErrorDTO> errors) {
        super(timestamp, status, error, message, path);
        this.errors = errors;
    }
}