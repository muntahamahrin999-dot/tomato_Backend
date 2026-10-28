
package com.example.tomato.entity;

import com.example.tomato.enums.ERole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Set;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @Column(nullable = false, updatable = false, length = 100)
    private String userName;

    @Column(length = 100)
    private String userFirstName;

    @Column(length = 100)
    private String userLastName;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(unique = true, length = 20)
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false)
    private Boolean credentialsNonExpired = true;

    @Column(nullable = false)
    private Boolean accountNonExpired = true;

    @Column(nullable = false)
    private Boolean accountNonLocked = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_name")
    )
    @Column(name = "role_name", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private Set<ERole> roles = EnumSet.of(ERole.ROLE_CUSTOMER);

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant lastUpdated;

    public User(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.roles = EnumSet.of(ERole.ROLE_CUSTOMER);
    }
}
