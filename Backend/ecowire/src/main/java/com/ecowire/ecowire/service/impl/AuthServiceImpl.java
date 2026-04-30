package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.enums.UserRole;
import com.ecowire.ecowire.exception.UserAlreadyExistsException;
import com.ecowire.ecowire.security.JwtUtil;
import com.ecowire.ecowire.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthServiceImpl implements AuthService {

    // Temporary in-memory user store (replace with JPA when Suraksha's entity is ready)
    private final Map<String, UserRecord> userStore = new ConcurrentHashMap<>();

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO registerUser(SignupRequestDTO request) {
        // Check duplicate username
        boolean usernameTaken = userStore.values().stream()
                .anyMatch(u -> u.username().equalsIgnoreCase(request.getUsername()));
        if (usernameTaken) {
            throw new UserAlreadyExistsException(
                    "Username '" + request.getUsername() + "' is already taken");
        }

        // Check duplicate email
        boolean emailTaken = userStore.values().stream()
                .anyMatch(u -> u.email().equalsIgnoreCase(request.getEmail()));
        if (emailTaken) {
            throw new UserAlreadyExistsException(
                    "Email '" + request.getEmail() + "' is already registered");
        }

        // Hash password and save
        String userId      = UUID.randomUUID().toString();
        String hashedPwd   = passwordEncoder.encode(request.getPassword());
        LocalDateTime now  = LocalDateTime.now();

        userStore.put(userId, new UserRecord(
                userId,
                request.getUsername(),
                request.getEmail(),
                hashedPwd,
                request.getRole(),
                now
        ));

        return new AuthResponseDTO(
                userId,
                request.getUsername(),
                request.getEmail(),
                request.getRole(),
                now
        );
    }

    @Override
    public LoginResponseDTO authenticateUser(LoginRequestDTO request) {
        // Find user by username
        UserRecord user = userStore.values().stream()
                .filter(u -> u.username().equalsIgnoreCase(request.getUsername()))
                .findFirst()
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.passwordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(
                user.userId(),
                user.username(),
                user.role().name()
        );

        return new LoginResponseDTO(token, user.role(), 86400L);
    }

    // Internal record to hold user data
    private record UserRecord(
            String userId,
            String username,
            String email,
            String passwordHash,
            UserRole role,
            LocalDateTime createdDate
    ) {}
}
