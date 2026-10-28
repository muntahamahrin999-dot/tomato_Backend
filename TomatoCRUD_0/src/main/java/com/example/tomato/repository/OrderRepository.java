package com.example.tomato.repository;

import com.example.tomato.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(String status);

    List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByRestaurantNameContainingIgnoreCase(String restaurantName);

    List<Order> findByCustomerEmail(String customerEmail);

    List<Order> findByCustomerPhone(String customerPhone);

    List<Order> findAllByOrderByCreatedAtDesc();
}
