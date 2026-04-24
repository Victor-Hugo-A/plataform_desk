package com.victor.serviceflow.user.dto;

import com.victor.serviceflow.user.UserRole;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role,
        String department,
        Boolean active,
        LocalDateTime createdAt
) {
}