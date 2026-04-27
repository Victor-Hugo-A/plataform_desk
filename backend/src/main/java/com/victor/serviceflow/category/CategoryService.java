package com.victor.serviceflow.category;

import com.victor.serviceflow.category.dto.CategoryRequest;
import com.victor.serviceflow.category.dto.CategoryResponse;
import com.victor.serviceflow.exception.BusinessException;
import com.victor.serviceflow.exception.ResourceNotFoundException;
import com.victor.serviceflow.ticket.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TicketRepository ticketRepository;

    public CategoryService(CategoryRepository categoryRepository, TicketRepository ticketRepository) {
        this.categoryRepository = categoryRepository;
        this.ticketRepository = ticketRepository;
    }

    public CategoryResponse create(CategoryRequest request) {
        String normalizedName = request.name().trim();
        String normalizedDescription = request.description() != null ? request.description().trim() : null;

        if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new BusinessException("JÃ¡ existe uma categoria cadastrada com esse nome.");
        }

        Category category = new Category();
        category.setName(normalizedName);
        category.setDescription(normalizedDescription == null || normalizedDescription.isBlank() ? null : normalizedDescription);

        Category savedCategory = categoryRepository.save(category);

        return toResponse(savedCategory);
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nÃ£o encontrada."));

        return toResponse(category);
    }

    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nÃ£o encontrada."));

        if (ticketRepository.existsByCategoryId(id)) {
            throw new BusinessException(
                    "Nao e possivel excluir uma categoria vinculada a chamados.",
                    HttpStatus.CONFLICT
            );
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getActive(),
                category.getCreatedAt()
        );
    }
}
