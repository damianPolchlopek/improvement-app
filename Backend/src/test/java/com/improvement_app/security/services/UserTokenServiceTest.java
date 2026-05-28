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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Pure unit tests for {@link UserTokenService}.
 *
 * Sprawdzamy: zapis tokenu, kryptograficzną losowość, rate-limiting,
 * walidację (expired/used/not-found) i poprawne oznaczenie tokenu jako użytego.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // setUp() stubuje rate-limit dla większości testów
@DisplayName("UserTokenService")
class UserTokenServiceTest {

    @Mock private UserTokenRepository userTokenRepository;
    @Mock private SecurityProperties securityProperties;
    @Mock private SecurityProperties.RateLimit rateLimitProps;

    @InjectMocks
    private UserTokenService userTokenService;

    @BeforeEach
    void setUp() {
        // Domyślny limit: 3 e-maile na godzinę
        when(securityProperties.getRateLimit()).thenReturn(rateLimitProps);
        when(rateLimitProps.getMaxEmailTokensPerHour()).thenReturn(3);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private UserEntity user() {
        return UserEntity.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // createToken
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("createToken()")
    class CreateToken {

        @Test
        @DisplayName("sukces → zapisuje token z domyślną ważnością (24h dla EMAIL_VERIFICATION)")
        void shouldCreateAndPersistTokenWithDefaultValidity() {
            // given
            UserEntity user = user();
            when(userTokenRepository.countByUserAndTypeAndCreatedAtAfter(
                    eq(user), eq(TokenTypeEnum.EMAIL_VERIFICATION), any()))
                    .thenReturn(0L);
            when(userTokenRepository.save(any(UserTokenEntity.class)))
                    .thenAnswer(inv -> inv.getArgument(0));

            // when
            UserTokenEntity result = userTokenService.createToken(user, TokenTypeEnum.EMAIL_VERIFICATION);

            // then
            ArgumentCaptor<UserTokenEntity> captor = ArgumentCaptor.forClass(UserTokenEntity.class);
            verify(userTokenRepository).save(captor.capture());
            UserTokenEntity saved = captor.getValue();

            assertThat(saved.getUser()).isSameAs(user);
            assertThat(saved.getType()).isEqualTo(TokenTypeEnum.EMAIL_VERIFICATION);
            assertThat(saved.getToken()).isNotBlank();
            assertThat(saved.getUsedAt()).isNull();
            assertThat(saved.getExpiresAt())
                    .isAfter(Instant.now().plus(Duration.ofHours(23)))
                    .isBefore(Instant.now().plus(Duration.ofHours(25)));
            assertThat(result).isSameAs(saved);
        }

        @Test
        @DisplayName("dwa tokeny dla tego samego usera → różne wartości (kryptograficznie losowe)")
        void shouldGenerateUniqueTokenValues() {
            UserEntity user = user();
            when(userTokenRepository.countByUserAndTypeAndCreatedAtAfter(
                    eq(user), any(), any())).thenReturn(0L);
            when(userTokenRepository.save(any(UserTokenEntity.class)))
                    .thenAnswer(inv -> inv.getArgument(0));

            UserTokenEntity t1 = userTokenService.createToken(user, TokenTypeEnum.EMAIL_VERIFICATION);
            UserTokenEntity t2 = userTokenService.createToken(user, TokenTypeEnum.EMAIL_VERIFICATION);

            assertThat(t1.getToken()).isNotEqualTo(t2.getToken());
            assertThat(t1.getToken().length()).isGreaterThanOrEqualTo(32); // 32B base64 ≈ 43 znaki
        }

        @Test
        @DisplayName("custom validity → expiresAt zgodne z parametrem")
        void shouldHonorCustomValidity() {
            UserEntity user = user();
            when(userTokenRepository.countByUserAndTypeAndCreatedAtAfter(
                    eq(user), any(), any())).thenReturn(0L);
            when(userTokenRepository.save(any(UserTokenEntity.class)))
                    .thenAnswer(inv -> inv.getArgument(0));

            Duration validity = Duration.ofMinutes(30);
            UserTokenEntity result = userTokenService.createToken(
                    user, TokenTypeEnum.PASSWORD_RESET, validity);

            assertThat(result.getExpiresAt())
                    .isBetween(
                            Instant.now().plus(Duration.ofMinutes(29)),
                            Instant.now().plus(Duration.ofMinutes(31)));
        }

        @Test
        @DisplayName("limit (3/h) osiągnięty → rzuca RateLimitExceededException, nic nie zapisuje")
        void shouldThrowWhenRateLimitExceeded() {
            UserEntity user = user();
            when(userTokenRepository.countByUserAndTypeAndCreatedAtAfter(
                    eq(user), eq(TokenTypeEnum.EMAIL_VERIFICATION), any()))
                    .thenReturn(3L); // == max

            assertThatThrownBy(() ->
                    userTokenService.createToken(user, TokenTypeEnum.EMAIL_VERIFICATION))
                    .isInstanceOf(RateLimitExceededException.class)
                    .hasMessageContaining("3 email requests per hour");

            verify(userTokenRepository, never()).save(any());
        }

        @Test
        @DisplayName("limit przekroczony (4 > 3) → rzuca RateLimitExceededException")
        void shouldThrowWhenCountAboveRateLimit() {
            UserEntity user = user();
            when(userTokenRepository.countByUserAndTypeAndCreatedAtAfter(
                    eq(user), eq(TokenTypeEnum.PASSWORD_RESET), any()))
                    .thenReturn(4L);

            assertThatThrownBy(() ->
                    userTokenService.createToken(user, TokenTypeEnum.PASSWORD_RESET))
                    .isInstanceOf(RateLimitExceededException.class);

            verify(userTokenRepository, never()).save(any());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // validateAndUseToken
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("validateAndUseToken()")
    class ValidateAndUseToken {

        @Test
        @DisplayName("poprawny, nieużyty, nieprzeterminowany token → oznacza usedAt i zwraca usera")
        void shouldMarkTokenUsedAndReturnUser() {
            UserEntity user = user();
            UserTokenEntity token = UserTokenEntity.builder()
                    .id(99L).user(user).token("abc")
                    .type(TokenTypeEnum.EMAIL_VERIFICATION)
                    .expiresAt(Instant.now().plus(Duration.ofHours(1)))
                    .build();

            when(userTokenRepository.findByTokenAndType("abc", TokenTypeEnum.EMAIL_VERIFICATION))
                    .thenReturn(Optional.of(token));
            when(userTokenRepository.save(token)).thenReturn(token);

            UserEntity returned = userTokenService.validateAndUseToken(
                    "abc", TokenTypeEnum.EMAIL_VERIFICATION);

            assertThat(returned).isSameAs(user);
            assertThat(token.getUsedAt()).isNotNull();
            assertThat(token.isUsed()).isTrue();
            verify(userTokenRepository).save(token);
        }

        @Test
        @DisplayName("token nie istnieje (lub nieprawidłowy typ) → rzuca InvalidTokenException")
        void shouldThrowWhenTokenNotFound() {
            when(userTokenRepository.findByTokenAndType("missing", TokenTypeEnum.EMAIL_VERIFICATION))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() ->
                    userTokenService.validateAndUseToken("missing", TokenTypeEnum.EMAIL_VERIFICATION))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Token not found");

            verify(userTokenRepository, never()).save(any());
        }

        @Test
        @DisplayName("token przeterminowany → rzuca TokenExpiredException, nic nie zapisuje")
        void shouldThrowWhenTokenExpired() {
            UserTokenEntity expired = UserTokenEntity.builder()
                    .id(1L).user(user()).token("exp")
                    .type(TokenTypeEnum.EMAIL_VERIFICATION)
                    .expiresAt(Instant.now().minusSeconds(10))
                    .build();

            when(userTokenRepository.findByTokenAndType("exp", TokenTypeEnum.EMAIL_VERIFICATION))
                    .thenReturn(Optional.of(expired));

            assertThatThrownBy(() ->
                    userTokenService.validateAndUseToken("exp", TokenTypeEnum.EMAIL_VERIFICATION))
                    .isInstanceOf(TokenExpiredException.class);

            verify(userTokenRepository, never()).save(any());
        }

        @Test
        @DisplayName("token już użyty → rzuca TokenAlreadyUsedException, nic nie zapisuje")
        void shouldThrowWhenTokenAlreadyUsed() {
            UserTokenEntity used = UserTokenEntity.builder()
                    .id(1L).user(user()).token("used")
                    .type(TokenTypeEnum.EMAIL_VERIFICATION)
                    .expiresAt(Instant.now().plus(Duration.ofHours(1)))
                    .usedAt(Instant.now().minusSeconds(60))
                    .build();

            when(userTokenRepository.findByTokenAndType("used", TokenTypeEnum.EMAIL_VERIFICATION))
                    .thenReturn(Optional.of(used));

            assertThatThrownBy(() ->
                    userTokenService.validateAndUseToken("used", TokenTypeEnum.EMAIL_VERIFICATION))
                    .isInstanceOf(TokenAlreadyUsedException.class);

            verify(userTokenRepository, never()).save(any());
        }

        @Test
        @DisplayName("powtórne użycie tego samego tokenu → drugi raz rzuca TokenAlreadyUsedException")
        void shouldRejectReuseOfSameToken() {
            UserEntity user = user();
            UserTokenEntity token = UserTokenEntity.builder()
                    .id(1L).user(user).token("once")
                    .type(TokenTypeEnum.EMAIL_VERIFICATION)
                    .expiresAt(Instant.now().plus(Duration.ofHours(1)))
                    .build();

            when(userTokenRepository.findByTokenAndType("once", TokenTypeEnum.EMAIL_VERIFICATION))
                    .thenReturn(Optional.of(token));
            when(userTokenRepository.save(token)).thenReturn(token);

            // 1) Pierwsze użycie - OK
            userTokenService.validateAndUseToken("once", TokenTypeEnum.EMAIL_VERIFICATION);
            assertThat(token.isUsed()).isTrue();

            // 2) Drugie użycie - zablokowane
            assertThatThrownBy(() ->
                    userTokenService.validateAndUseToken("once", TokenTypeEnum.EMAIL_VERIFICATION))
                    .isInstanceOf(TokenAlreadyUsedException.class);
        }
    }
}
