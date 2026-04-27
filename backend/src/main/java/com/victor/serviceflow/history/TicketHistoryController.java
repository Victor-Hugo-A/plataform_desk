package com.victor.serviceflow.history;

import com.victor.serviceflow.history.dto.TicketHistoryResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ticket-history")
public class TicketHistoryController {

    private final TicketHistoryService ticketHistoryService;

    public TicketHistoryController(TicketHistoryService ticketHistoryService) {
        this.ticketHistoryService = ticketHistoryService;
    }

    @GetMapping("/ticket/{ticketId}")
    public List<TicketHistoryResponse> findByTicketId(@PathVariable Long ticketId) {
        return ticketHistoryService.findByTicketId(ticketId);
    }
}
