package com.example.tomato.config;

import com.example.tomato.entity.User;
import com.example.tomato.enums.ERole;
import com.example.tomato.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.username:admin}")
    private String adminUsername;

    @Value("${app.default-admin.email:admin@tomato.com}")
    private String adminEmail;

    @Value("${app.default-admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedSuperAdmin();
    }

    private void seedSuperAdmin() {
        boolean adminExistsByEmail = userRepository.existsByEmailIgnoreCase(adminEmail);
        boolean adminExistsByUsername = userRepository.existsByUserNameIgnoreCase(adminUsername);

        if (!adminExistsByEmail && !adminExistsByUsername) {
            log.info("[DataInitializer] No Super Admin found. Creating initial Super Admin...");

            User admin = new User();
            admin.setUserName(adminUsername);
            admin.setUserFirstName("Super");
            admin.setUserLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPhoneNumber("01700000000");
            admin.setPassword(passwordEncoder.encode(adminPassword));

            Set<ERole> roles = new HashSet<>();
            roles.add(ERole.ROLE_ADMIN);
            admin.setRoles(roles);

            admin.setEnabled(true);
            admin.setAccountNonExpired(true);
            admin.setAccountNonLocked(true);
            admin.setCredentialsNonExpired(true);
            admin.setDateCreated(Instant.now());
            admin.setLastUpdated(Instant.now());

            userRepository.save(admin);
            log.info("[DataInitializer] Super Admin successfully created: username='{}', email='{}'", adminUsername, adminEmail);
        } else {
            // Ensure existing admin user has the ROLE_ADMIN assigned
            userRepository.findByEmail(adminEmail).or(() -> userRepository.findByUserName(adminUsername)).ifPresent(user -> {
                if (!user.getRoles().contains(ERole.ROLE_ADMIN)) {
                    user.getRoles().add(ERole.ROLE_ADMIN);
                    userRepository.save(user);
                    log.info("[DataInitializer] Updated existing user '{}' to include ROLE_ADMIN", user.getUserName());
                }
            });
            log.info("[DataInitializer] Super Admin already exists: username='{}', email='{}'", adminUsername, adminEmail);
        }
    }
}
