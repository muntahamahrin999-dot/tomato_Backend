package com.example.tomato.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "riders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rider extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 50)
    private String vehicle = "Motorcycle";

    @Column(length = 100)
    private String zone;

    private Integer ordersCount = 0;

    private Double rating = 4.8;

    @Column(length = 30)
    private String status = "Active"; // Active, On Delivery, Pending, Suspended
}
