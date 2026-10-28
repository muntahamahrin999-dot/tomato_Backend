package com.example.tomato.controller;

import com.example.tomato.DTOs.JwtResponse;
import com.example.tomato.DTOs.LoginRequest;
import com.example.tomato.DTOs.SignupRequest;
import com.example.tomato.entity.User;
import com.example.tomato.enums.ERole;
import com.example.tomato.repository.UserRepository;
import com.example.tomato.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        String username = signupRequest.getUsername();
        if (username == null || username.isBlank()) {
            if (signupRequest.getEmail() != null) {
                username = signupRequest.getEmail().split("@")[0] + "_" + System.currentTimeMillis() % 10000;
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Username or email is required!"));
            }
        }

        if (userRepository.existsByUserNameIgnoreCase(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }

        if (signupRequest.getEmail() != null && userRepository.existsByEmailIgnoreCase(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        User user = new User();
        user.setUserName(username);
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhone());
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);

        if (signupRequest.getName() != null) {
            String[] parts = signupRequest.getName().trim().split("\\s+", 2);
            user.setUserFirstName(parts[0]);
            if (parts.length > 1) {
                user.setUserLastName(parts[1]);
            }
        }

        Set<ERole> roles = new HashSet<>();
        String requestedRole = signupRequest.getRole() != null ? signupRequest.getRole().toLowerCase() : "customer";

        switch (requestedRole) {
            case "admin":
                roles.add(ERole.ROLE_ADMIN);
                break;
            case "restaurant":
            case "restaurant_owner":
                roles.add(ERole.ROLE_RESTAURANT_OWNER);
                break;
            case "rider":
            case "delivery":
                roles.add(ERole.ROLE_RIDER);
                break;
            default:
                roles.add(ERole.ROLE_CUSTOMER);
                break;
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateTokenFromUsername(savedUser);

        List<String> roleNames = savedUser.getRoles().stream()
                .map(ERole::name)
                .collect(Collectors.toList());

        String primaryRole = roleNames.isEmpty() ? "ROLE_CUSTOMER" : roleNames.get(0);

        String fullName = (savedUser.getUserFirstName() != null ? savedUser.getUserFirstName() : "")
                + (savedUser.getUserLastName() != null ? " " + savedUser.getUserLastName() : "");
        if (fullName.isBlank()) {
            fullName = savedUser.getUserName();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new JwtResponse(token, savedUser.getUserName(), savedUser.getEmail(), fullName.trim(), primaryRole, roleNames)
        );
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String identifier = loginRequest.getEmail();
        if (identifier == null || identifier.isBlank()) {
            identifier = loginRequest.getUsername();
        }

        if (identifier == null || identifier.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email or username is required"));
        }

        Optional<User> userOptional = userRepository.findByEmail(identifier);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByUserName(identifier);
        }

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username/email or password!"));
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username/email or password!"));
        }

        String token = jwtUtil.generateTokenFromUsername(user);

        List<String> roleNames = user.getRoles().stream()
                .map(ERole::name)
                .collect(Collectors.toList());

        String primaryRole = roleNames.isEmpty() ? "ROLE_CUSTOMER" : roleNames.get(0);

        String fullName = (user.getUserFirstName() != null ? user.getUserFirstName() : "")
                + (user.getUserLastName() != null ? " " + user.getUserLastName() : "");
        if (fullName.isBlank()) {
            fullName = user.getUserName();
        }

        return ResponseEntity.ok(
                new JwtResponse(token, user.getUserName(), user.getEmail(), fullName.trim(), primaryRole, roleNames)
        );
    }
}
