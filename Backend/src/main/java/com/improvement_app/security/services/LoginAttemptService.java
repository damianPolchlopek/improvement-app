package com.improvement_app.security.services;

import com.improvement_app.security.config.SecurityProperties;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private final UserRepository userRepository;
    private final SecurityProperties securityProperties;

    // service zostal utworzony, poniewaz przy wyjatku pole z liczba nieudanych zalogowan,
    // bylo rollbackowane przez rzucony wyjatek
    // Stworzenie transakcji z Propagation.REQUIRES_NEW w poprzedniej glownej klasie nie naprawilo rollbacku,
    // przez to ze byl wspolny obiekt UserEntity

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailedAttempt(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        int max = securityProperties.getRateLimit().getMaxLoginAttempts();
        int lockMinutes = securityProperties.getRateLimit().getLockDurationMinutes();
        userEntity.incrementFailedAttempts(max, lockMinutes);
        userRepository.save(userEntity);
        log.warn("Failed login attempt {}/{} for user: {}",
                userEntity.getFailedLoginAttempts(), max, userEntity.getUsername());
    }

}
