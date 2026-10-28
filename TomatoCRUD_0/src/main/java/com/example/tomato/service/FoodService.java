package com.example.tomato.service;

import com.example.tomato.entity.Food;
import com.example.tomato.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    @Transactional
    public Food createFood(Food food) {
        if (food.getAvailable() == null) {
            food.setAvailable(true);
        }
        if (food.getRating() == null) {
            food.setRating(4.7);
        }
        if (food.getPreparationTime() == null) {
            food.setPreparationTime(20);
        }
        if (food.getIcon() == null || food.getIcon().isBlank()) {
            food.setIcon("🍽️");
        }
        return foodRepository.save(food);
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> getAvailableFoods() {
        return foodRepository.findByAvailableTrue();
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }

    public List<Food> getFoodsByCategory(String categoryName) {
        return foodRepository.findByCategoryNameIgnoreCase(categoryName);
    }

    public List<Food> searchFoods(String query) {
        return foodRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Food> getFoodsByRestaurant(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }

    @Transactional
    public Food updateFood(Long id, Food updatedData) {
        Food existing = getFoodById(id);

        if (updatedData.getName() != null) existing.setName(updatedData.getName());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getPrice() != null) existing.setPrice(updatedData.getPrice());
        if (updatedData.getCategoryName() != null) existing.setCategoryName(updatedData.getCategoryName());
        if (updatedData.getRestaurantName() != null) existing.setRestaurantName(updatedData.getRestaurantName());
        if (updatedData.getImage() != null) existing.setImage(updatedData.getImage());
        if (updatedData.getIcon() != null) existing.setIcon(updatedData.getIcon());
        if (updatedData.getAvailable() != null) existing.setAvailable(updatedData.getAvailable());
        if (updatedData.getPreparationTime() != null) existing.setPreparationTime(updatedData.getPreparationTime());
        if (updatedData.getRating() != null) existing.setRating(updatedData.getRating());

        return foodRepository.save(existing);
    }

    @Transactional
    public Food toggleAvailability(Long id) {
        Food existing = getFoodById(id);
        existing.setAvailable(!Boolean.TRUE.equals(existing.getAvailable()));
        return foodRepository.save(existing);
    }

    @Transactional
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new RuntimeException("Food item not found with id: " + id);
        }
        foodRepository.deleteById(id);
    }
}
