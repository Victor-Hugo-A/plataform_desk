package com.victor.serviceflow.auth.dto;

import com.victor.serviceflow.user.UserRole;

public record LoginResponse(
        Long id,
        String name,
        String email,
        UserRole role,
        String message
) {
}