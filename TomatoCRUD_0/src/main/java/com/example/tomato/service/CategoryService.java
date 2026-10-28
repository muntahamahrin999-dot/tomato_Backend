package com.example.tomato.service;

import com.example.tomato.entity.Category;
import com.example.tomato.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategory(Category category) {
        if (category.getActive() == null) {
            category.setActive(true);
        }
        if (category.getIcon() == null || category.getIcon().isBlank()) {
            category.setIcon("🍔");
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Transactional
    public Category updateCategory(Long id, Category updatedData) {
        Category existing = getCategoryById(id);

        if (updatedData.getName() != null) existing.setName(updatedData.getName());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getIcon() != null) existing.setIcon(updatedData.getIcon());
        if (updatedData.getActive() != null) existing.setActive(updatedData.getActive());
        if (updatedData.getImageUrls() != null && !updatedData.getImageUrls().isEmpty()) {
            existing.setImageUrls(updatedData.getImageUrls());
        }

        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
