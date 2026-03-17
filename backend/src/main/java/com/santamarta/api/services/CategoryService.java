package com.santamarta.api.services;

import com.santamarta.api.models.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryService {
    List<Category> getAllCategories();
    Optional<Category> getCategoryById(UUID id);
    Category createCategory(Category category);
}
