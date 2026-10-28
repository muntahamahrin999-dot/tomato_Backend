package com.example.tomato.repository;

import com.example.tomato.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByAvailableTrue();

    List<Food> findByCategoryNameIgnoreCase(String categoryName);

    List<Food> findByNameContainingIgnoreCase(String name);

    List<Food> findByRestaurantId(Long restaurantId);
}
