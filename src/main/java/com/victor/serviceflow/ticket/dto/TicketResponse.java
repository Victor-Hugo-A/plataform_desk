package com.victor.serviceflow.ticket.dto;

import com.victor.serviceflow.ticket.TicketPriority;
import com.victor.serviceflow.ticket.TicketStatus;

import java.time.LocalDateTime;

public record TicketResponse(
        Long id,
        String protocol,
        String title,
        String description,
        TicketStatus status,
        TicketPriority priority,
        String categoryName,
        String requesterName,
        String assignedTechnicianName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime resolvedAt,
        LocalDateTime slaDeadline
) {
}