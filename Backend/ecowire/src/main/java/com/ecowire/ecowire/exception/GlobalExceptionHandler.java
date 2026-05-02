package com.ecowire.ecowire.exception;

import com.ecowire.ecowire.dto.ErrorResponseDTO;
import com.ecowire.ecowire.dto.FieldErrorDTO;
import com.ecowire.ecowire.dto.ValidationErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(PolicyNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handlePolicyNotFound(
            PolicyNotFoundException ex,
            HttpServletRequest request) {

        logger.error("Policy not found: {}", ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidPolicyTypeException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidPolicyType(
            InvalidPolicyTypeException ex,
            HttpServletRequest request) {

        logger.error("Invalid policy type: {}", ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponseDTO> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        logger.error("Validation failed: {}", ex.getMessage());

        List<FieldErrorDTO> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> new FieldErrorDTO(err.getField(), err.getDefaultMessage()))
                .collect(Collectors.toList());

        ValidationErrorResponseDTO error = new ValidationErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Validation failed",
                request.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ScoringException.class)
    public ResponseEntity<ErrorResponseDTO> handleScoringException(
            ScoringException ex,
            HttpServletRequest request) {

        logger.error("Scoring error: {}", ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Error calculating eco score: " + ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGlobalException(
            Exception ex,
            HttpServletRequest request) {

        logger.error("Unexpected error at {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExists(
            UserAlreadyExistsException ex,
            HttpServletRequest request) {

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Conflict",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                "Invalid username or password",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

}
