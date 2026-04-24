package com.victor.serviceflow.auth.dto;

import com.victor.serviceflow.user.UserRole;

public record RegisterRequest(
        String name,
        String email,
        String password,
        UserRole role,
        String department
) {
}