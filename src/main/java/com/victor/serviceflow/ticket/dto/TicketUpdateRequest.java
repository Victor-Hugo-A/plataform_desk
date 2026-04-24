package com.victor.serviceflow.ticket.dto;

import com.victor.serviceflow.ticket.TicketPriority;
import com.victor.serviceflow.ticket.TicketStatus;

public record TicketUpdateRequest(
        String title,
        String description,
        TicketStatus status,
        TicketPriority priority,
        Long categoryId,
        Long assignedTechnicianId
) {
}