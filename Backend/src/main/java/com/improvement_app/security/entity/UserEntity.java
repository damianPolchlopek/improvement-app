package com.improvement_app.security.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "users", schema = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @NotBlank(message = "Email is required")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    @Email(message = "Email must be valid")
    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 255, message = "Password hash too long") // Zwiększone z 120 na 255!
    @JsonIgnore
    @Column(nullable = false, length = 255)
    private String password;

    @Size(max = 50)
    @Column(length = 50)
    private String name;

    @Size(max = 50)
    @Column(length = 50)
    private String surname;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", schema = "users",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    private Boolean isActive = false;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "last_login")
    private Instant lastLogin;

    public UserEntity(String username, String email, String password, String name, String surname) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
    }

    public List<String> getRolesString() {
        return roles.stream()
                .map(r -> r.getName().toString())
                .toList();
    }


}