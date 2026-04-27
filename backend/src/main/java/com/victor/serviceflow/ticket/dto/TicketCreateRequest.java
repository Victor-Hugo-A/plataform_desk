package com.victor.serviceflow.ticket.dto;

import com.victor.serviceflow.ticket.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketCreateRequest(
        @NotBlank(message = "O titulo do chamado e obrigatorio.")
        @Size(max = 150, message = "O titulo do chamado deve ter no maximo 150 caracteres.")
        String title,
        @NotBlank(message = "A descricao do chamado e obrigatoria.")
        @Size(max = 5000, message = "A descricao do chamado deve ter no maximo 5000 caracteres.")
        String description,
        TicketPriority priority,
        @NotNull(message = "A categoria do chamado e obrigatoria.")
        Long categoryId,
        @NotNull(message = "O solicitante do chamado e obrigatorio.")
        Long requesterId
) {
}
