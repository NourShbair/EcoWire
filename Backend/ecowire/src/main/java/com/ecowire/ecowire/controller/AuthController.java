package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.AuthResponseDTO;
import com.ecowire.ecowire.dto.LoginRequestDTO;
import com.ecowire.ecowire.dto.LoginResponseDTO;
import com.ecowire.ecowire.dto.SignupRequestDTO;
import com.ecowire.ecowire.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDTO> signup(
            @RequestBody @Valid SignupRequestDTO request) {
        AuthResponseDTO response = authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO request) {
        LoginResponseDTO response = authService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }
}
