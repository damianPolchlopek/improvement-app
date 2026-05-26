package com.improvement_app.security.oauth2;

import com.improvement_app.security.entity.ERole;
import com.improvement_app.security.entity.Role;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.RoleRepository;
import com.improvement_app.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String email = oidcUser.getEmail();
        String googleId = oidcUser.getSubject();
        String firstName = oidcUser.getGivenName();
        String lastName = oidcUser.getFamilyName();

        userRepository.findByEmail(email)
                .ifPresentOrElse(
                        existing -> linkGoogleAccount(existing, googleId),
                        () -> createGoogleUser(email, googleId, firstName, lastName)
                );

        log.info("OIDC login successful for email: {}", email);
        return oidcUser;
    }

    private void linkGoogleAccount(UserEntity user, String googleId) {
        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            userRepository.save(user);
            log.info("Linked Google account to existing user: {}", user.getUsername());
        }
    }

    private UserEntity createGoogleUser(String email, String googleId, String firstName, String lastName) {
        String username = generateUniqueUsername(email);

        UserEntity user = new UserEntity(
                username,
                email,
                passwordEncoder.encode(UUID.randomUUID().toString()),
                firstName,
                lastName
        );

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRoles(Set.of(userRole));
        user.setGoogleId(googleId);
        user.setEmailVerified(true);
        user.setIsActive(true);

        UserEntity saved = userRepository.save(user);
        log.info("Created new Google user: {}", username);
        return saved;
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        if (base.length() > 16) base = base.substring(0, 16);

        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }
        return candidate;
    }
}
