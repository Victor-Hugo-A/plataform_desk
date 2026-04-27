package com.victor.serviceflow.user.dto;

import com.victor.serviceflow.user.UserRole;

public record UserUpdateRequest(
        String name,
        String email,
        UserRole role,
        String department,
        Boolean active,
        Long actorId
) {
}
