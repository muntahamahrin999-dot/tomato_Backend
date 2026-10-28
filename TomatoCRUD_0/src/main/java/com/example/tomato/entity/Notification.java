package com.example.tomato.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {

    private String userName;

    private String title;

    @Column(length = 1000)
    private String message;

    private Boolean read = false;

    private String type;
}