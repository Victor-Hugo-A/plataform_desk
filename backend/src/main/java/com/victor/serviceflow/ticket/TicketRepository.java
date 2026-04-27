package com.victor.serviceflow.ticket;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(TicketStatus status);

    long countByStatus(TicketStatus status);

    long countByPriority(TicketPriority priority);

    boolean existsByCategoryId(Long categoryId);
}
