package com.improvement_app.security.services;

import com.improvement_app.security.command.request.LoginRequest;
import com.improvement_app.security.command.request.SignupRequest;
import com.improvement_app.security.command.response.JwtResponse;
import com.improvement_app.security.exceptions.RoleNotFoundException;
import com.improvement_app.security.exceptions.UserAlreadyExistsException;
import com.improvement_app.security.jwt.JwtUtils;
import com.improvement_app.security.models.ERole;
import com.improvement_app.security.models.Role;
import com.improvement_app.security.models.User;
import com.improvement_app.security.repository.RoleRepository;
import com.improvement_app.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @Transactional(readOnly = true)
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.debug("Authenticating user: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        log.debug("User authenticated successfully: {}", userDetails.getUsername());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), roles);
    }

    @Transactional
    public void registerUser(SignupRequest signUpRequest) {
        log.debug("Registering new user: {}", signUpRequest.getUsername());

        validateUserRegistration(signUpRequest);

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = determineUserRoles(signUpRequest.getRole());
        user.setRoles(roles);

        userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());
    }

    private void validateUserRegistration(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken: " + signUpRequest.getUsername());
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email is already in use: " + signUpRequest.getEmail());
        }
    }

    private Set<Role> determineUserRoles(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RoleNotFoundException("Default user role not found"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin" -> {
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RoleNotFoundException("Admin role not found"));
                        roles.add(adminRole);
                    }
                    case "user" -> {
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RoleNotFoundException("User role not found"));
                        roles.add(userRole);
                    }
                    default -> throw new RoleNotFoundException("Role not found: " + role);
                }
            });
        }

        return roles;
    }
}
