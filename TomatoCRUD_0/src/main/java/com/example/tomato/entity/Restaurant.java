package com.example.tomato.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    private String owner;

    private String category;

    @Column(length = 500)
    private String address;

    @Column(length = 255)
    private String location;

    private String phone;

    private String email;

    @Column(length = 2000)
    private String description;

    @ElementCollection
    @CollectionTable(
            name = "restaurant_images",
            joinColumns = @JoinColumn(name = "restaurant_id")
    )
    @Column(name = "image_url", length = 1000)
    @OrderColumn(name = "image_order")
    private List<String> imageUrls = new ArrayList<>();

    private Double rating = 4.5;

    private Integer ordersCount = 0;

    private String status = "Active";

    private Boolean active = true;

    private String openingTime;

    private String closingTime;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Food> foods = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
}