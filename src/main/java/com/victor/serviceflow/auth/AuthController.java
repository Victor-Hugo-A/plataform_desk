package com.victor.serviceflow.auth;

import com.victor.serviceflow.auth.dto.LoginRequest;
import com.victor.serviceflow.auth.dto.LoginResponse;
import com.victor.serviceflow.auth.dto.RegisterRequest;
import com.victor.serviceflow.user.dto.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}