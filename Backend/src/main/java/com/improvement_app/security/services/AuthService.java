package com.improvement_app.security.services;

import com.improvement_app.security.entity.*;
import com.improvement_app.security.exceptions.EmailNotVerifiedException;
import com.improvement_app.security.exceptions.RoleNotFoundException;
import com.improvement_app.security.exceptions.UserAlreadyExistsException;
import com.improvement_app.security.jwt.JwtUtils;
import com.improvement_app.security.repository.RoleRepository;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.security.request.LoginRequest;
import com.improvement_app.security.request.RefreshTokenRequest;
import com.improvement_app.security.request.SignupRequest;
import com.improvement_app.security.response.JwtResponse;
import com.improvement_app.security.response.RefreshTokenResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    private final UserTokenService userTokenService;

    @Transactional
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.debug("Authenticating user: {}", loginRequest.username());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Sprawdź czy email został zweryfikowany
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        UserEntity userEntity = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!userEntity.getEmailVerified()) {
            throw new EmailNotVerifiedException("Email must be verified before login");
        }

        userEntity.setLastLogin(Instant.now());
        userRepository.save(userEntity);

        String accessToken = jwtUtils.generateJwtToken(userDetails.getUsername(), userEntity.getRolesString());
        String refreshToken = jwtUtils.generateRefreshToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        log.debug("User authenticated successfully: {}", userDetails.getUsername());

        return new JwtResponse(accessToken, refreshToken, userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), roles);
    }

    public RefreshTokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.refreshToken();

        try {
            Claims claims = jwtUtils.validateToken(refreshToken);
            String username = claims.getSubject();

            String accessToken = jwtUtils.generateJwtToken(username, List.of("ROLE_USER"));
            return RefreshTokenResponse.of(accessToken);

        } catch (JwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token niepoprawny");
        }
    }

    @Transactional
    public void registerUser(SignupRequest signUpRequest) {
        log.debug("Registering new user: {}", signUpRequest.getUsername());

        validateUserRegistration(signUpRequest);

        UserEntity userEntity = new UserEntity(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getName(),
                signUpRequest.getSurname()
        );

        Set<Role> roles = determineUserRoles(signUpRequest.getRole());
        userEntity.setRoles(roles);

        // Dodaj pola weryfikacji emaila
        userEntity.setEmailVerified(false);
        userEntity.setIsActive(false);
        UserEntity savedUser = userRepository.save(userEntity);

        // Wygeneruj token weryfikacyjny
        UserTokenEntity token = userTokenService.createToken(savedUser, TokenTypeEnum.EMAIL_VERIFICATION);

        // Wyślij email weryfikacyjny
        emailService.sendVerificationEmail(savedUser.getEmail(), token);

        log.info("User registered successfully: {}. Verification email sent.", userEntity.getUsername());
    }

    @Transactional
    public String verifyEmail(String token) {
        log.debug("Verifying email with token: {}", token);

        UserEntity userEntity = userTokenService.validateAndUseToken(token, TokenTypeEnum.EMAIL_VERIFICATION);

        userEntity.setEmailVerified(true);
        userEntity.setIsActive(true);

        userRepository.save(userEntity);

        log.info("Email verified successfully for user: {}", userEntity.getUsername());

        return "Email verified successfully. You can now log in.";
    }

    @Transactional
    public String resendVerificationEmail(String username) {
        log.debug("Resending verification email to: {}", username);

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("No account found with this username"));

        //todo: nie pozwol wysylac ponownych emaili po weryfikacji konta

        UserTokenEntity verificationToken = userTokenService.createToken(userEntity, TokenTypeEnum.EMAIL_VERIFICATION);

        emailService.sendVerificationEmail(userEntity.getEmail(), verificationToken);

        log.info("Verification email resent to: {}", userEntity.getEmail());

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