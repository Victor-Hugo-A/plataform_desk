package com.victor.serviceflow.history;

import com.victor.serviceflow.history.dto.TicketHistoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketHistoryService {

    private final TicketHistoryRepository ticketHistoryRepository;

    public TicketHistoryService(TicketHistoryRepository ticketHistoryRepository) {
        this.ticketHistoryRepository = ticketHistoryRepository;
    }

    public List<TicketHistoryResponse> findByTicketId(Long ticketId) {
        return ticketHistoryRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TicketHistoryResponse toResponse(TicketHistory history) {
        return new TicketHistoryResponse(
                history.getId(),
                history.getAction(),
                history.getOldValue(),
                history.getNewValue(),
                history.getPerformedBy().getName(),
                history.getCreatedAt()
        );
    }
}
