package com.improvement_app.security.jwt;

import com.improvement_app.security.config.SecurityProperties;
import com.improvement_app.security.entity.ERole;
import com.improvement_app.security.services.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Pure unit tests for {@link JwtUtils} — żadnego kontekstu Springa.
 *
 * Sprawdzamy: poprawność wystawiania tokenów (access/refresh),
 * walidację podpisu, wykrywanie wygaśnięcia oraz odporność na manipulacje.
 */
@DisplayName("JwtUtils")
class JwtUtilsTest {

    // Sekret >= 256 bit dla HMAC-SHA256 (Keys.hmacShaKeyFor wymaga 32 bajtów).
    private static final String TEST_SECRET =
            "dGVzdC1zZWNyZXQta2V5LWZvci10ZXN0aW5nLW9ubHktbXVzdC1iZS1sb25nLWVub3VnaA==";

    private SecurityProperties securityProperties;
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        securityProperties = new SecurityProperties();
        securityProperties.getJwt().setSecret(TEST_SECRET);
        securityProperties.getJwt().setAccessTokenExpirationMs(900_000);      // 15 min
        securityProperties.getJwt().setRefreshTokenExpirationMs(259_200_000); // 3 dni
        jwtUtils = new JwtUtils(securityProperties);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // generateJwtToken (access token)
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("generateJwtToken()")
    class GenerateAccessToken {

        @Test
        @DisplayName("sukces → zwraca trzyczęściowy JWT z poprawnym subject")
        void shouldReturnThreePartJwtWithUsername() {
            String token = jwtUtils.generateJwtToken("alice", List.of(ERole.ROLE_USER.name()));

            assertThat(token).isNotBlank();
            assertThat(token.split("\\.")).hasSize(3); // header.payload.signature
            assertThat(jwtUtils.getUserNameFromJwtToken(token)).isEqualTo("alice");
        }

        @Test
        @DisplayName("zawiera roszczenie 'roles' z przekazanymi rolami")
        void shouldEmbedRolesClaim() {
            String token = jwtUtils.generateJwtToken(
                    "alice", List.of("ROLE_USER", "ROLE_ADMIN"));

            Claims claims = jwtUtils.validateToken(token);
            assertThat(claims.get("roles", List.class))
                    .containsExactlyInAnyOrder("ROLE_USER", "ROLE_ADMIN");
        }

        @Test
        @DisplayName("ustawia issuedAt i expiration w przyszłości")
        void shouldSetIssuedAtAndExpiration() {
            long beforeMs = System.currentTimeMillis();
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));

            Claims claims = jwtUtils.validateToken(token);

            assertThat(claims.getIssuedAt()).isNotNull();
            assertThat(claims.getIssuedAt().getTime()).isGreaterThanOrEqualTo(beforeMs - 1000);
            assertThat(claims.getExpiration().getTime())
                    .isGreaterThan(beforeMs)
                    .isLessThanOrEqualTo(beforeMs + 900_000 + 1000);
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // generateRefreshToken
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("generateRefreshToken()")
    class GenerateRefreshToken {

        @Test
        @DisplayName("z Authentication zawierającym UserDetailsImpl → token z subjectem = username")
        void shouldGenerateRefreshFromAuthentication() {
            UserDetailsImpl principal = new UserDetailsImpl(
                    1L, "alice", "alice@example.com", "encoded-pwd",
                    List.of(new SimpleGrantedAuthority("ROLE_USER")), true);
            Authentication auth = mock(Authentication.class);
            when(auth.getPrincipal()).thenReturn(principal);

            String refresh = jwtUtils.generateRefreshToken(auth);

            assertThat(refresh).isNotBlank();
            assertThat(jwtUtils.getUserNameFromJwtToken(refresh)).isEqualTo("alice");
        }

        @Test
        @DisplayName("z podanym username → token z tym właśnie subjectem")
        void shouldGenerateRefreshFromUsernameString() {
            String refresh = jwtUtils.generateRefreshToken("bob");

            assertThat(refresh).isNotBlank();
            assertThat(jwtUtils.getUserNameFromJwtToken(refresh)).isEqualTo("bob");
        }

        @Test
        @DisplayName("refresh token ma dłuższą datę wygaśnięcia niż access token")
        void refreshShouldOutliveAccessToken() {
            String access  = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));
            String refresh = jwtUtils.generateRefreshToken("alice");

            long accessExp  = jwtUtils.validateToken(access).getExpiration().getTime();
            long refreshExp = jwtUtils.validateToken(refresh).getExpiration().getTime();

            assertThat(refreshExp).isGreaterThan(accessExp);
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // validateJwtToken (boolean)
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("validateJwtToken()")
    class ValidateJwtTokenBoolean {

        @Test
        @DisplayName("własny, świeży token → true")
        void shouldReturnTrueForOwnFreshToken() {
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));

            assertThat(jwtUtils.validateJwtToken(token)).isTrue();
        }

        @Test
        @DisplayName("token podpisany innym sekretem → false")
        void shouldReturnFalseForTokenSignedWithDifferentKey() {
            SecurityProperties otherProps = new SecurityProperties();
            otherProps.getJwt().setSecret(
                    "aW5uZS10YWplbW5lLWtsdWN6LWtvbmllY3puaWUtZGx1Z2ktbmEtaG1hYy1zaGEyNTY=");
            JwtUtils other = new JwtUtils(otherProps);

            String foreignToken = other.generateJwtToken("alice", List.of("ROLE_USER"));

            assertThat(jwtUtils.validateJwtToken(foreignToken)).isFalse();
        }

        @Test
        @DisplayName("malformed token → false")
        void shouldReturnFalseForMalformedToken() {
            assertThat(jwtUtils.validateJwtToken("not.a.valid.jwt")).isFalse();
        }

        @Test
        @DisplayName("pusty string → false")
        void shouldReturnFalseForEmptyString() {
            assertThat(jwtUtils.validateJwtToken("")).isFalse();
        }

        @Test
        @DisplayName("wygasły token → false")
        void shouldReturnFalseForExpiredToken() throws InterruptedException {
            // krótki TTL by wymusić expiry
            securityProperties.getJwt().setAccessTokenExpirationMs(1);
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));
            Thread.sleep(50);

            assertThat(jwtUtils.validateJwtToken(token)).isFalse();
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // validateToken (rzuca wyjątek)
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("validateToken()")
    class ValidateTokenThrowing {

        @Test
        @DisplayName("poprawny token → zwraca Claims z subject i expiration")
        void shouldReturnClaimsForValidToken() {
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));

            Claims claims = jwtUtils.validateToken(token);

            assertThat(claims.getSubject()).isEqualTo("alice");
            assertThat(claims.getExpiration()).isInTheFuture();
            assertThat(claims.getIssuedAt()).isNotNull();
        }

        @Test
        @DisplayName("podrobiony podpis → rzuca JwtException")
        void shouldThrowJwtExceptionForTamperedSignature() {
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));
            // zniszcz signature
            String tampered = token.substring(0, token.lastIndexOf('.') + 1) + "AAAA";

            assertThatThrownBy(() -> jwtUtils.validateToken(tampered))
                    .isInstanceOf(JwtException.class);
        }

        @Test
        @DisplayName("wygasły token → rzuca ExpiredJwtException")
        void shouldThrowExpiredJwtExceptionWhenTokenExpired() throws InterruptedException {
            securityProperties.getJwt().setAccessTokenExpirationMs(1);
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));
            Thread.sleep(50);

            assertThatThrownBy(() -> jwtUtils.validateToken(token))
                    .isInstanceOf(ExpiredJwtException.class);
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // getUserNameFromJwtToken
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("getUserNameFromJwtToken()")
    class GetUserName {

        @Test
        @DisplayName("zwraca username z subject claim")
        void shouldExtractUsernameFromSubject() {
            String token = jwtUtils.generateJwtToken("alice", List.of("ROLE_USER"));

            assertThat(jwtUtils.getUserNameFromJwtToken(token)).isEqualTo("alice");
        }

        @Test
        @DisplayName("nieprawidłowy podpis → rzuca JwtException")
        void shouldThrowOnInvalidToken() {
            assertThatThrownBy(() -> jwtUtils.getUserNameFromJwtToken("not-a-jwt"))
                    .isInstanceOf(JwtException.class);
        }
    }
}
