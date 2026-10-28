package com.example.tomato.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String name;
    private String username;
    private String email;
    private String phone;
    private String password;
    private String role; // "customer", "restaurant", "rider", "admin"
}
