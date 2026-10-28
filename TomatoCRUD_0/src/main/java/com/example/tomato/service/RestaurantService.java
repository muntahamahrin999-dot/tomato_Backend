package com.example.tomato.service;

import com.example.tomato.entity.Restaurant;
import com.example.tomato.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Transactional
    public Restaurant createRestaurant(Restaurant restaurant) {
        if (restaurant.getRating() == null) {
            restaurant.setRating(4.5);
        }
        if (restaurant.getOrdersCount() == null) {
            restaurant.setOrdersCount(0);
        }
        if (restaurant.getStatus() == null || restaurant.getStatus().isBlank()) {
            restaurant.setStatus("Active");
        }
        if (restaurant.getActive() == null) {
            restaurant.setActive(true);
        }
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    @Transactional
    public Restaurant updateRestaurant(Long id, Restaurant updatedData) {
        Restaurant existing = getRestaurantById(id);

        if (updatedData.getName() != null) existing.setName(updatedData.getName());
        if (updatedData.getOwner() != null) existing.setOwner(updatedData.getOwner());
        if (updatedData.getCategory() != null) existing.setCategory(updatedData.getCategory());
        if (updatedData.getAddress() != null) existing.setAddress(updatedData.getAddress());
        if (updatedData.getLocation() != null) existing.setLocation(updatedData.getLocation());
        if (updatedData.getPhone() != null) existing.setPhone(updatedData.getPhone());
        if (updatedData.getEmail() != null) existing.setEmail(updatedData.getEmail());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getRating() != null) existing.setRating(updatedData.getRating());
        if (updatedData.getOrdersCount() != null) existing.setOrdersCount(updatedData.getOrdersCount());
        if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
        if (updatedData.getActive() != null) existing.setActive(updatedData.getActive());
        if (updatedData.getOpeningTime() != null) existing.setOpeningTime(updatedData.getOpeningTime());
        if (updatedData.getClosingTime() != null) existing.setClosingTime(updatedData.getClosingTime());
        if (updatedData.getImageUrls() != null && !updatedData.getImageUrls().isEmpty()) {
            existing.setImageUrls(updatedData.getImageUrls());
        }

        return restaurantRepository.save(existing);
    }

    @Transactional
    public void deleteRestaurant(Long id) {
        if (!restaurantRepository.existsById(id)) {
            throw new RuntimeException("Restaurant not found with id: " + id);
        }
        restaurantRepository.deleteById(id);
    }

    public List<Restaurant> findByStatus(String status) {
        return restaurantRepository.findByStatus(status);
    }

    public List<Restaurant> searchByName(String name) {
        return restaurantRepository.findByNameContainingIgnoreCase(name);
    }
}
