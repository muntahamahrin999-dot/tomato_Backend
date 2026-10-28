
        package com.example.tomato.service;

import com.example.tomato.entity.Role;
import com.example.tomato.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    // Create Role
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    // Get All Roles
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Get Role by roleName
    public Role getRoleByName(String roleName) {
        return roleRepository.findById(roleName)
                .orElseThrow(() ->
                        new RuntimeException("Role not found: " + roleName)
                );
    }

    // Update Role
    public Role updateRole(String roleName, Role role) {

        Role existingRole = roleRepository.findById(roleName)
                .orElseThrow(() ->
                        new RuntimeException("Role not found: " + roleName)
                );

        existingRole.setRoleDescription(role.getRoleDescription());

        return roleRepository.save(existingRole);
    }

    // Delete Role
    public void deleteRole(String roleName) {

        if (!roleRepository.existsById(roleName)) {
            throw new RuntimeException("Role not found: " + roleName);
        }

        roleRepository.deleteById(roleName);
    }
}
