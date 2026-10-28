
        package com.example.tomato.repository;

import com.example.tomato.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    // Find Role by roleName
    Role findByRoleName(String roleName);

    // Check whether a Role exists by roleName
    boolean existsByRoleName(String roleName);
}