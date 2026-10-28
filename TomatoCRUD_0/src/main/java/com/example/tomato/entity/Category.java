package com.example.tomato.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(
            name = "category_images",
            joinColumns = @JoinColumn(name = "category_id")
    )
    @Column(name = "image_url", length = 1000)
    @OrderColumn(name = "image_order")
    private List<String> imageUrls = new ArrayList<>();

    private String icon = "🍔";

    private Boolean active = true;

    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Food> foods = new ArrayList<>();
}