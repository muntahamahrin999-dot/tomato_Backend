package com.example.tomato.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private String name;
    private String role;
    private List<String> roles;

    public JwtResponse(String token, String username, String email, String name, String role, List<String> roles) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.name = name;
        this.role = role;
        this.roles = roles;
    }
}
