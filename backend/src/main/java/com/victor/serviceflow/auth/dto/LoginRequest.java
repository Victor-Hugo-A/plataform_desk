package com.victor.serviceflow.auth.dto;

public record LoginRequest(
        String email,
        String password
) {
}