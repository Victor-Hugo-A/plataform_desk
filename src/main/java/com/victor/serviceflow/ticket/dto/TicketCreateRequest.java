package com.victor.serviceflow.ticket.dto;

import com.victor.serviceflow.ticket.TicketPriority;

public record TicketCreateRequest(
        String title,
        String description,
        TicketPriority priority,
        Long categoryId,
        Long requesterId
) {
}