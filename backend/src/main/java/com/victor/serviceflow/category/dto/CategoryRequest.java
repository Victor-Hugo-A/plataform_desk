package com.victor.serviceflow.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "O nome da categoria e obrigatorio.")
        @Size(max = 100, message = "O nome da categoria deve ter no maximo 100 caracteres.")
        String name,
        @Size(max = 255, message = "A descricao da categoria deve ter no maximo 255 caracteres.")
        String description
) {
}
