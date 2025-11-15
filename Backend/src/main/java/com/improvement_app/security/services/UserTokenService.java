package com.improvement_app.security.services;

import com.improvement_app.security.entity.TokenTypeEnum;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.entity.UserTokenEntity;
import com.improvement_app.security.exceptions.InvalidTokenException;
import com.improvement_app.security.exceptions.TokenAlreadyUsedException;
import com.improvement_app.security.exceptions.TokenExpiredException;
import com.improvement_app.security.repository.UserTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Transactional
public class UserTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_LENGTH = 32;
    private static final int MAX_TOKENS_PER_HOUR = 5; // rate limiting

    private final UserTokenRepository userTokenRepository;

    /**
     * Create a new token for user with default validity
     */
    public UserTokenEntity createToken(UserEntity user, TokenTypeEnum type) {
        return createToken(user, type, type.getDefaultValidity());
    }

    public UserTokenEntity createToken(UserEntity user, TokenTypeEnum type, Duration validity) {
        // Rate limiting check
//        checkRateLimit(user, type);

        // Generate secure token
        String tokenValue = generateSecureToken();

        // Create token entity
        UserTokenEntity token = UserTokenEntity.builder()
                .user(user)
                .token(tokenValue)
                .type(type)
                .expiresAt(Instant.now().plus(validity))
                .build();

        return userTokenRepository.save(token);
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[TOKEN_LENGTH];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public UserEntity validateAndUseToken(String tokenValue, TokenTypeEnum expectedType) {
        UserTokenEntity token = userTokenRepository.findByTokenAndType(tokenValue, expectedType)
                .orElseThrow(() -> new InvalidTokenException("Token not found or invalid type"));

        validateToken(token);

        token.markAsUsed();
        userTokenRepository.save(token);

        return token.getUser();
    }

    private void validateToken(UserTokenEntity token) {
        if (token.isExpired()) {
            throw new TokenExpiredException("Token has expired at: " + token.getExpiresAt());
        }

        if (token.isUsed()) {
            throw new TokenAlreadyUsedException("Token was already used at: " + token.getUsedAt());
        }
    }


}
