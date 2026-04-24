package com.victor.serviceflow.dashboard.dto;

public record DashboardSummaryResponse(
        long totalTickets,
        long openTickets,
        long inProgressTickets,
        long resolvedTickets,
        long criticalTickets
) {
}