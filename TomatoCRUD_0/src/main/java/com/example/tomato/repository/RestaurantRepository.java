package com.example.tomato.repository;

import com.example.tomato.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByStatus(String status);

    List<Restaurant> findByNameContainingIgnoreCase(String name);

    List<Restaurant> findByCategory(String category);
}
