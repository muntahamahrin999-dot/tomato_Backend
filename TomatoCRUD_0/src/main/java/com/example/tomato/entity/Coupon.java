package com.example.tomato.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coupon")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon extends BaseEntity {

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(length = 255)
    private String title;

    @Column(length = 50)
    private String discountType = "Percentage"; // Percentage, Fixed

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrder = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    private BigDecimal maxDiscount = BigDecimal.ZERO;

    private Integer usageLimit = 100;

    private Integer usedCount = 0;

    private String startDate;

    private String expiryDate;

    @Column(length = 30)
    private String status = "Active"; // Active, Expired, Inactive

    @Column(length = 1000)
    private String description;

    private Boolean active = true;

    @OneToMany(mappedBy = "coupon")
    private List<Order> orders = new ArrayList<>();
}