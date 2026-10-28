package com.example.tomato.controller;

import com.example.tomato.entity.Food;
import com.example.tomato.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        Food created = foodService.createFood(food);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(foodService.searchFoods(search.trim()));
        }
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(foodService.getFoodsByCategory(category.trim()));
        }
        if (restaurantId != null) {
            return ResponseEntity.ok(foodService.getFoodsByRestaurant(restaurantId));
        }
        if (availableOnly) {
            return ResponseEntity.ok(foodService.getAvailableFoods());
        }

        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(foodService.getFoodById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFood(
            @PathVariable Long id,
            @RequestBody Food food) {
        try {
            return ResponseEntity.ok(foodService.updateFood(id, food));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<Food> toggleAvailability(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(foodService.toggleAvailability(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        try {
            foodService.deleteFood(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
