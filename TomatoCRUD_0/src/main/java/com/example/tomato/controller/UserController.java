
        package com.example.tomato.controller;

import com.example.tomato.entity.User;
import com.example.tomato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Create User
    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user) {

        User savedUser = userService.createUser(user);

        return new ResponseEntity<>(
                savedUser,
                HttpStatus.CREATED
        );
    }

    // Get All Users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    // Get User by username
    @GetMapping("/{userName}")
    public ResponseEntity<User> getUser(
            @PathVariable String userName) {

        try {
            return ResponseEntity.ok(
                    userService.getUserByUsername(userName)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update User
    @PutMapping("/{userName}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userName,
            @RequestBody User user) {

        try {
            return ResponseEntity.ok(
                    userService.updateUser(userName, user)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete User
    @DeleteMapping("/{userName}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable String userName) {

        try {
            userService.deleteUser(userName);
            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}