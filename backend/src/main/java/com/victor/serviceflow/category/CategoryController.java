package com.victor.serviceflow.category;

import com.victor.serviceflow.category.dto.CategoryRequest;
import com.victor.serviceflow.category.dto.CategoryResponse;
import com.victor.serviceflow.exception.BusinessException;
import com.victor.serviceflow.user.UserRole;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @Valid @RequestBody CategoryRequest request
    ) {
        if (!UserRole.ADMIN.name().equalsIgnoreCase(userRole)) {
            throw new BusinessException("Somente administradores podem cadastrar categorias.", HttpStatus.FORBIDDEN);
        }

        return categoryService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @PathVariable Long id
    ) {
        if (!UserRole.ADMIN.name().equalsIgnoreCase(userRole)) {
            throw new BusinessException("Somente administradores podem excluir categorias.", HttpStatus.FORBIDDEN);
        }

        categoryService.delete(id);
    }

    @GetMapping
    public List<CategoryResponse> findAll() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public CategoryResponse findById(@PathVariable Long id) {
        return categoryService.findById(id);
    }
}
