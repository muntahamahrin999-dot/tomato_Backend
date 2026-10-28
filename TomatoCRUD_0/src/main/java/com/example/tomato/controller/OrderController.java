package com.example.tomato.controller;

import com.example.tomato.entity.Order;
import com.example.tomato.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order created = orderService.createOrder(order);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String restaurant,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone) {

        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(orderService.getOrdersByStatus(status));
        }
        if (restaurant != null && !restaurant.isBlank()) {
            return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurant));
        }
        if ((email != null && !email.isBlank()) || (phone != null && !phone.isBlank())) {
            return ResponseEntity.ok(orderService.getOrdersByCustomer(email, phone));
        }

        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            return ResponseEntity.ok(orderService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/payment")
    public ResponseEntity<Order> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            String paymentStatus = payload.get("paymentStatus");
            return ResponseEntity.ok(orderService.updatePaymentStatus(id, paymentStatus));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
