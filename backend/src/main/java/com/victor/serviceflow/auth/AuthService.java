package com.victor.serviceflow.auth;

import com.victor.serviceflow.auth.dto.LoginRequest;
import com.victor.serviceflow.auth.dto.LoginResponse;
import com.victor.serviceflow.auth.dto.RegisterRequest;
import com.victor.serviceflow.exception.BusinessException;
import com.victor.serviceflow.user.User;
import com.victor.serviceflow.user.UserRepository;
import com.victor.serviceflow.user.UserRole;
import com.victor.serviceflow.user.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe um usuário cadastrado com esse e-mail.");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setDepartment(request.department());
        user.setRole(request.role() != null ? request.role() : UserRole.USER);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getDepartment(),
                savedUser.getActive(),
                savedUser.getCreatedAt()
        );
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("E-mail ou senha inválidos."));

        if (!user.getPassword().equals(request.password())) {
            throw new BusinessException("E-mail ou senha inválidos.");
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login realizado com sucesso."
        );
    }
}