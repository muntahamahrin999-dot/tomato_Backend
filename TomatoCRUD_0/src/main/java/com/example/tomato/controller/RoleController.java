
        package com.example.tomato.controller;

import com.example.tomato.entity.Role;
import com.example.tomato.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    // Create Role
    @PostMapping
    public ResponseEntity<Role> createRole(
            @RequestBody Role role) {

        Role savedRole = roleService.createRole(role);

        return new ResponseEntity<>(
                savedRole,
                HttpStatus.CREATED
        );
    }

    // Get All Roles
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {

        return ResponseEntity.ok(
                roleService.getAllRoles()
        );
    }

    // Get Role by roleName
    @GetMapping("/{roleName}")
    public ResponseEntity<Role> getRole(
            @PathVariable String roleName) {

        try {
            return ResponseEntity.ok(
                    roleService.getRoleByName(roleName)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update Role
    @PutMapping("/{roleName}")
    public ResponseEntity<Role> updateRole(
            @PathVariable String roleName,
            @RequestBody Role role) {

        try {
            return ResponseEntity.ok(
                    roleService.updateRole(roleName, role)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete Role
    @DeleteMapping("/{roleName}")
    public ResponseEntity<Void> deleteRole(
            @PathVariable String roleName) {

        try {
            roleService.deleteRole(roleName);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

