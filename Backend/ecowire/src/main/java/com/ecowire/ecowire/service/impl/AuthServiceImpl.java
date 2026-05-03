package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.entity.User;
import com.ecowire.ecowire.enums.UserRole;
import com.ecowire.ecowire.exception.OrganizationNotFoundException;
import com.ecowire.ecowire.exception.UserAlreadyExistsException;
import com.ecowire.ecowire.repository.UserRepository;
import com.ecowire.ecowire.security.JwtUtil;
import com.ecowire.ecowire.service.AuthService;
import com.ecowire.ecowire.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired private UserRepository     userRepository;
    @Autowired private PasswordEncoder    passwordEncoder;
    @Autowired private JwtUtil            jwtUtil;
    @Autowired private OrganizationService organizationService;

    @Override
    @Transactional
    public AuthResponseDTO registerUser(SignupRequestDTO request) {

        // Check duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username '" + request.getUsername() + "' is already taken");
        }

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email '" + request.getEmail() + "' is already registered");
        }

        UserRole role = request.getRole();
        String organizationId = request.getOrganizationId();

        // Org-scoped roles require a valid organizationId
        boolean isOrgScoped = role == UserRole.AGENT
                || role == UserRole.UNDERWRITER
                || role == UserRole.REPORTING
                || role == UserRole.AUDITOR;

        if (isOrgScoped) {
            if (organizationId == null || organizationId.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "organizationId is required for role " + role);
            }
            if (!organizationService.organizationExists(organizationId)) {
                throw new OrganizationNotFoundException(organizationId);
            }
        } else {
            // CUSTOMER and ADMIN — ignore any supplied organizationId
            organizationId = null;
        }

        // Hash password and persist user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setOrganizationId(organizationId);
        user = userRepository.save(user);

        return new AuthResponseDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedDate()
        );
    }

    @Override
    public LoginResponseDTO authenticateUser(LoginRequestDTO request) {

        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Generate JWT — include organizationId claim for org-scoped roles
        String token = jwtUtil.generateToken(
                user.getUserId(),
                user.getUsername(),
                user.getRole().name(),
                user.getOrganizationId()
        );

        return new LoginResponseDTO(token, user.getRole(), 86400L, user.getOrganizationId());
    }
}
