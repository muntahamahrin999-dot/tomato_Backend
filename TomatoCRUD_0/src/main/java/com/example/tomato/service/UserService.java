
        package com.example.tomato.service;

import com.example.tomato.entity.User;
import com.example.tomato.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Create User
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User by username
    public User getUserByUsername(String userName) {
        return userRepository.findById(userName)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + userName)
                );
    }

    // Update User
    public User updateUser(String userName, User user) {

        User existingUser = userRepository.findById(userName)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + userName)
                );

        existingUser.setUserFirstName(user.getUserFirstName());
        existingUser.setUserLastName(user.getUserLastName());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());
        existingUser.setEnabled(user.getEnabled());
        existingUser.setCredentialsNonExpired(
                user.getCredentialsNonExpired()
        );
        existingUser.setAccountNonExpired(
                user.getAccountNonExpired()
        );
        existingUser.setAccountNonLocked(
                user.getAccountNonLocked()
        );
        existingUser.setRoles(user.getRoles());

        return userRepository.save(existingUser);
    }

    // Delete User
    public void deleteUser(String userName) {

        if (!userRepository.existsById(userName)) {
            throw new RuntimeException("User not found: " + userName);
        }

        userRepository.deleteById(userName);
    }
}

