package com.improvement_app.security.services;

import com.improvement_app.security.command.request.LoginRequest;
import com.improvement_app.security.command.request.SignupRequest;
import com.improvement_app.security.command.response.JwtResponse;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.exceptions.RoleNotFoundException;
import com.improvement_app.security.exceptions.UserAlreadyExistsException;
import com.improvement_app.security.exceptions.EmailNotVerifiedException;
import com.improvement_app.security.exceptions.InvalidTokenException;
import com.improvement_app.security.jwt.JwtUtils;
import com.improvement_app.security.entity.ERole;
import com.improvement_app.security.entity.Role;
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

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.debug("Authenticating user: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Sprawdź czy email został zweryfikowany
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        UserEntity userEntity = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!userEntity.isEmailVerified()) {
            throw new EmailNotVerifiedException("Email must be verified before login");
        }

        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        log.debug("User authenticated successfully: {}", userDetails.getUsername());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), roles);
    }

    @Transactional
    public String registerUser(SignupRequest signUpRequest) {
        log.debug("Registering new user: {}", signUpRequest.getUsername());

        validateUserRegistration(signUpRequest);

        UserEntity userEntity = new UserEntity(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = determineUserRoles(signUpRequest.getRole());
        userEntity.setRoles(roles);

        // Dodaj pola weryfikacji emaila
        userEntity.setEmailVerified(false);
        userEntity.setActive(false);

        // Wygeneruj token weryfikacyjny
        String verificationToken = UUID.randomUUID().toString();
        userEntity.setEmailVerificationToken(verificationToken);
        userEntity.setEmailVerificationExpires(LocalDateTime.now().plusHours(24));

        userRepository.save(userEntity);

        // Wyślij email weryfikacyjny
        emailService.sendVerificationEmail(userEntity.getEmail(), verificationToken);

        log.info("User registered successfully: {}. Verification email sent.", userEntity.getUsername());

        return "User registered successfully. Please check your email to verify your account.";
    }

    @Transactional
    public String verifyEmail(String token) {
        log.debug("Verifying email with token: {}", token);

        UserEntity userEntity = userRepository.findByEmailVerificationTokenAndEmailVerificationExpiresAfterAndEmailVerifiedFalse(
                        token, LocalDateTime.now())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired verification token"));

        userEntity.setEmailVerified(true);
        userEntity.setActive(true);
        userEntity.setEmailVerificationToken(null);
        userEntity.setEmailVerificationExpires(null);

        userRepository.save(userEntity);

        log.info("Email verified successfully for user: {}", userEntity.getUsername());

        return "Email verified successfully. You can now log in.";
    }

    @Transactional
    public String resendVerificationEmail(String username) {
        log.debug("Resending verification email to: {}", username);

        UserEntity userEntity = userRepository.findByUsernameAndEmailVerifiedFalse(username)
                .orElseThrow(() -> new RuntimeException("No unverified account found with this username"));

        // Wygeneruj nowy token
        String verificationToken = UUID.randomUUID().toString();
        userEntity.setEmailVerificationToken(verificationToken);
        userEntity.setEmailVerificationExpires(LocalDateTime.now().plusHours(24));

        userRepository.save(userEntity);

        // Wyślij email
        emailService.sendVerificationEmail(userEntity.getEmail(), verificationToken);

        log.info("Verification email resent to: {}", username);

        return "Verification email sent successfully.";
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