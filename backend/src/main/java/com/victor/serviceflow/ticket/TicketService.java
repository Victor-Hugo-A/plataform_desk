package com.victor.serviceflow.ticket;

import com.victor.serviceflow.category.Category;
import com.victor.serviceflow.category.CategoryRepository;
import com.victor.serviceflow.exception.ResourceNotFoundException;
import com.victor.serviceflow.ticket.dto.TicketCreateRequest;
import com.victor.serviceflow.ticket.dto.TicketResponse;
import com.victor.serviceflow.user.User;
import com.victor.serviceflow.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public TicketResponse create(TicketCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        User requester = userRepository.findById(request.requesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Solicitante não encontrado."));

        Ticket ticket = new Ticket();
        ticket.setProtocol(generateProtocol());
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority() != null ? request.priority() : TicketPriority.MEDIUM);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCategory(category);
        ticket.setRequester(requester);
        ticket.setSlaDeadline(calculateSlaDeadline(ticket.getPriority()));

        Ticket savedTicket = ticketRepository.save(ticket);

        return toResponse(savedTicket);
    }

    public List<TicketResponse> findAll() {
        return ticketRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TicketResponse findById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado."));

        return toResponse(ticket);
    }

    public TicketResponse updateStatus(Long id, TicketStatus newStatus) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado."));

        ticket.setStatus(newStatus);
        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        return toResponse(updatedTicket);
    }

    private String generateProtocol() {
        long nextNumber = ticketRepository.count() + 1;
        int year = LocalDateTime.now().getYear();

        return String.format("SF-%d-%06d", year, nextNumber);
    }

    private LocalDateTime calculateSlaDeadline(TicketPriority priority) {
        LocalDateTime now = LocalDateTime.now();

        return switch (priority) {
            case LOW -> now.plusHours(72);
            case MEDIUM -> now.plusHours(48);
            case HIGH -> now.plusHours(24);
            case CRITICAL -> now.plusHours(4);
        };
    }

    private TicketResponse toResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getProtocol(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCategory().getName(),
                ticket.getRequester().getName(),
                ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getName() : null,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getResolvedAt(),
                ticket.getSlaDeadline()
        );
    }
}