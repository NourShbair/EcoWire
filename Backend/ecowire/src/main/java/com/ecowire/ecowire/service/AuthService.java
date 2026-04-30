package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.AuthResponseDTO;
import com.ecowire.ecowire.dto.LoginRequestDTO;
import com.ecowire.ecowire.dto.LoginResponseDTO;
import com.ecowire.ecowire.dto.SignupRequestDTO;

public interface AuthService {
    AuthResponseDTO registerUser(SignupRequestDTO request);
    LoginResponseDTO authenticateUser(LoginRequestDTO request);
}