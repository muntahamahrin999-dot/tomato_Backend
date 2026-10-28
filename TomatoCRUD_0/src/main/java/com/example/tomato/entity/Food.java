package com.example.tomato.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Food extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    private String categoryName;

    private String restaurantName;

    private String image;

    private String icon = "🍽️";

    @ElementCollection
    @CollectionTable(
            name = "food_images",
            joinColumns = @JoinColumn(name = "food_id")
    )
    @Column(name = "image_url", length = 1000)
    @OrderColumn(name = "image_order")
    private List<String> imageUrls = new ArrayList<>();

    private Boolean available = true;

    private Integer preparationTime = 20;

    private Double rating = 4.7;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = true)
    private Restaurant restaurant;

    @JsonIgnore
    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();
}