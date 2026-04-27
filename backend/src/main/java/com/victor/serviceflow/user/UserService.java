package com.victor.serviceflow.user;

import com.victor.serviceflow.exception.BusinessException;
import com.victor.serviceflow.exception.ResourceNotFoundException;
import com.victor.serviceflow.user.dto.UserResponse;
import com.victor.serviceflow.user.dto.UserUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        return toResponse(user);
    }

    public UserResponse update(Long id, UserUpdateRequest request) {
        validateAdmin(request.actorId());

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        if (!user.getEmail().equalsIgnoreCase(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Ja existe um usuario cadastrado com este e-mail.");
        }

        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(request.role());
        user.setDepartment(request.department());
        user.setActive(request.active());

        return toResponse(userRepository.save(user));
    }

    public void delete(Long id, Long actorId) {
        User actor = validateAdmin(actorId);

        if (actor.getId().equals(id)) {
            throw new BusinessException("Voce nao pode excluir o proprio usuario.", HttpStatus.FORBIDDEN);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        userRepository.delete(user);
    }

    private User validateAdmin(Long actorId) {
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        if (actor.getRole() != UserRole.ADMIN) {
            throw new BusinessException("Apenas administradores podem executar esta acao.", HttpStatus.FORBIDDEN);
        }

        return actor;
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getActive(),
                user.getCreatedAt()
        );
    }
}
