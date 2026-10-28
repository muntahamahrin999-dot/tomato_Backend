package com.example.tomato.service;

import com.example.tomato.entity.Order;
import com.example.tomato.entity.OrderItem;
import com.example.tomato.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null || order.getOrderNumber().isBlank()) {
            order.setOrderNumber("#ORD-" + (System.currentTimeMillis() % 1000000));
        }
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }
        if (order.getPaymentStatus() == null || order.getPaymentStatus().isBlank()) {
            order.setPaymentStatus("PENDING");
        }
        if (order.getPaymentMethod() == null || order.getPaymentMethod().isBlank()) {
            order.setPaymentMethod("Cash on Delivery");
        }
        if (order.getDeliveryFee() == null) {
            order.setDeliveryFee(BigDecimal.valueOf(60));
        }
        if (order.getDiscount() == null) {
            order.setDiscount(BigDecimal.ZERO);
        }

        // Connect child items to parent order
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            BigDecimal computedTotal = BigDecimal.ZERO;
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
                if (item.getPrice() != null && item.getQuantity() != null) {
                    item.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                    computedTotal = computedTotal.add(item.getSubtotal());
                }
            }
            if (order.getTotalAmount() == null || order.getTotalAmount().compareTo(BigDecimal.ZERO) == 0) {
                order.setTotalAmount(computedTotal);
            }
            order.setItemsCount(order.getOrderItems().size());
        }

        if (order.getFinalAmount() == null || order.getFinalAmount().compareTo(BigDecimal.ZERO) == 0) {
            BigDecimal total = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            BigDecimal fee = order.getDeliveryFee() != null ? order.getDeliveryFee() : BigDecimal.ZERO;
            BigDecimal disc = order.getDiscount() != null ? order.getDiscount() : BigDecimal.ZERO;
            order.setFinalAmount(total.add(fee).subtract(disc));
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> getOrdersByRestaurant(String restaurantName) {
        return orderRepository.findByRestaurantNameContainingIgnoreCase(restaurantName);
    }

    public List<Order> getOrdersByCustomer(String email, String phone) {
        if (email != null && !email.isBlank()) {
            return orderRepository.findByCustomerEmail(email);
        }
        if (phone != null && !phone.isBlank()) {
            return orderRepository.findByCustomerPhone(phone);
        }
        return getAllOrders();
    }

    @Transactional
    public Order updateStatus(Long id, String status) {
        Order existing = getOrderById(id);
        existing.setStatus(status.toUpperCase().trim());
        if ("DELIVERED".equalsIgnoreCase(status) && "Cash on Delivery".equalsIgnoreCase(existing.getPaymentMethod())) {
            existing.setPaymentStatus("PAID");
        }
        return orderRepository.save(existing);
    }

    @Transactional
    public Order updatePaymentStatus(Long id, String paymentStatus) {
        Order existing = getOrderById(id);
        existing.setPaymentStatus(paymentStatus.toUpperCase().trim());
        return orderRepository.save(existing);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
}
