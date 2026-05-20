package com.improvement_app.security.services;

import com.improvement_app.security.config.SecurityProperties;
import com.improvement_app.security.entity.TokenTypeEnum;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.entity.UserTokenEntity;
import com.improvement_app.security.exceptions.InvalidTokenException;
import com.improvement_app.security.exceptions.RateLimitExceededException;
import com.improvement_app.security.exceptions.TokenAlreadyUsedException;
import com.improvement_app.security.exceptions.TokenExpiredException;
import com.improvement_app.security.repository.UserTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_LENGTH = 32;

    private final UserTokenRepository userTokenRepository;
    private final SecurityProperties securityProperties;

    public UserTokenEntity createToken(UserEntity user, TokenTypeEnum type) {
        return createToken(user, type, type.getDefaultValidity());
    }

    public UserTokenEntity createToken(UserEntity user, TokenTypeEnum type, Duration validity) {
        checkRateLimit(user, type);

        String tokenValue = generateSecureToken();

        UserTokenEntity token = UserTokenEntity.builder()
                .user(user)
                .token(tokenValue)
                .type(type)
                .expiresAt(Instant.now().plus(validity))
                .build();

        return userTokenRepository.save(token);
    }

    public UserEntity validateAndUseToken(String tokenValue, TokenTypeEnum expectedType) {
        UserTokenEntity token = userTokenRepository.findByTokenAndType(tokenValue, expectedType)
                .orElseThrow(() -> new InvalidTokenException("Token not found or invalid type"));

        validateToken(token);

        token.markAsUsed();
        userTokenRepository.save(token);

        return token.getUser();
    }

    private void checkRateLimit(UserEntity user, TokenTypeEnum type) {
        int maxPerHour = securityProperties.getRateLimit().getMaxEmailTokensPerHour();
        Instant oneHourAgo = Instant.now().minus(Duration.ofHours(1));

        long count = userTokenRepository.countByUserAndTypeAndCreatedAtAfter(user, type, oneHourAgo);

        if (count >= maxPerHour) {
            log.warn("Rate limit exceeded for user: {} type: {}", user.getUsername(), type);
            throw new RateLimitExceededException(
                    "Maximum " + maxPerHour + " email requests per hour exceeded. Try again later."
            );
        }
    }

    private void validateToken(UserTokenEntity token) {
        if (token.isExpired()) {
            throw new TokenExpiredException("Token has expired at: " + token.getExpiresAt());
        }

        if (token.isUsed()) {
            throw new TokenAlreadyUsedException("Token was already used at: " + token.getUsedAt());
        }
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[TOKEN_LENGTH];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
