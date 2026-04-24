package com.victor.serviceflow.history.dto;

import java.time.LocalDateTime;

public record TicketHistoryResponse(
        Long id,
        String action,
        String oldValue,
        String newValue,
        String performedByName,
        LocalDateTime createdAt
) {
}