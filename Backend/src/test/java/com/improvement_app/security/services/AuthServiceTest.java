package com.improvement_app.security.services;

import com.improvement_app.security.config.SecurityProperties;
import com.improvement_app.security.entity.*;
import com.improvement_app.security.exceptions.*;
import com.improvement_app.security.jwt.JwtUtils;
import com.improvement_app.security.repository.RoleRepository;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.security.request.LoginRequest;
import com.improvement_app.security.request.SignupRequest;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // setUp() ma stuby używane tylko w części testów
@DisplayName("AuthService")
class AuthServiceTest {

    // ── Mocks ────────────────────────────────────────────────────────────────
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserRepository         userRepository;
    @Mock private RoleRepository         roleRepository;
    @Mock private PasswordEncoder        encoder;
    @Mock private JwtUtils               jwtUtils;
    @Mock private EmailService           emailService;
    @Mock private UserTokenService       userTokenService;
    @Mock private SecurityProperties     securityProperties;
    @Mock private LoginAttemptService    loginAttemptService;

    @InjectMocks
    private AuthService authService;

    // ── Setup ────────────────────────────────────────────────────────────────

    @BeforeEach
    void setUp() {
        // Domyślna konfiguracja JWT (15 min access / 3 dni refresh).
        // Używana przez testy logowania i refresh; ignorowana przez resztę.
        when(securityProperties.getJwt()).thenReturn(new SecurityProperties.Jwt());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Typowy, aktywny user z zweryfikowanym mailem. */
    private UserEntity activeVerifiedUser() {
        return UserEntity.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encoded-password")
                .emailVerified(true)
                .isActive(true)
                .failedLoginAttempts(0)
                .roles(Set.of(new Role(ERole.ROLE_USER)))
                .build();
    }

    private static LoginRequest loginRequest() {
        return new LoginRequest("testuser", "password123");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // authenticateUser
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("authenticateUser()")
    class AuthenticateUser {

        @Test
        @DisplayName("sukces → zwraca tokeny, resetuje licznik prób, zapisuje lastLogin")
        void shouldReturnTokensResetCounterAndSaveLastLogin() {
            // given
            UserEntity user = activeVerifiedUser();
            Authentication auth = mock(Authentication.class);

            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
            when(authenticationManager.authenticate(any())).thenReturn(auth);
            when(jwtUtils.generateJwtToken(eq("testuser"), any())).thenReturn("access-token");
            when(jwtUtils.generateRefreshToken(auth)).thenReturn("refresh-token");
            when(userRepository.save(user)).thenReturn(user);

            // when
            AuthService.AuthResult result = authService.authenticateUser(loginRequest());

            // then – tokeny
            assertThat(result.accessToken()).isEqualTo("access-token");
            assertThat(result.refreshToken()).isEqualTo("refresh-token");

            // then – info o userze
            assertThat(result.userInfo().getUsername()).isEqualTo("testuser");
            assertThat(result.userInfo().getEmail()).isEqualTo("test@example.com");

            // then – efekty uboczne na encji
            assertThat(user.getFailedLoginAttempts()).isZero();
            assertThat(user.getLastLogin()).isNotNull();
            verify(userRepository).save(user);
        }

        @Test
        @DisplayName("złe hasło → rejestruje nieudaną próbę i propaguje BadCredentialsException")
        void shouldRecordFailedAttemptOnBadCredentials() {
            // given
            UserEntity user = activeVerifiedUser();
            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new BadCredentialsException("bad credentials"));

            // when / then
            assertThatThrownBy(() -> authService.authenticateUser(loginRequest()))
                    .isInstanceOf(BadCredentialsException.class);

            verify(loginAttemptService).recordFailedAttempt(1L);
        }

        @Test
        @DisplayName("konto zablokowane → rzuca AccountLockedException, nie próbuje uwierzytelniać")
        void shouldThrowAccountLockedWithoutCallingAuthManager() {
            // given
            UserEntity lockedUser = UserEntity.builder()
                    .id(2L)
                    .username("testuser")
                    .email("test@example.com")
                    .password("encoded-password")
                    .emailVerified(true)
                    .isActive(true)
                    .failedLoginAttempts(5)
                    .lockedUntil(Instant.now().plusSeconds(900)) // blokada na 15 min
                    .roles(Set.of(new Role(ERole.ROLE_USER)))
                    .build();

            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(lockedUser));

            // when / then
            assertThatThrownBy(() -> authService.authenticateUser(loginRequest()))
                    .isInstanceOf(AccountLockedException.class);

            verifyNoInteractions(authenticationManager);
        }

        @Test
        @DisplayName("email niezweryfikowany → rzuca EmailNotVerifiedException, nie generuje tokenów")
        void shouldThrowEmailNotVerifiedAndNotIssueTokens() {
            // given
            UserEntity unverifiedUser = UserEntity.builder()
                    .id(3L)
                    .username("testuser")
                    .email("test@example.com")
                    .password("encoded-password")
                    .emailVerified(false)
                    .isActive(false)
                    .failedLoginAttempts(0)
                    .roles(Set.of(new Role(ERole.ROLE_USER)))
                    .build();

            Authentication auth = mock(Authentication.class);
            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(unverifiedUser));
            when(authenticationManager.authenticate(any())).thenReturn(auth);

            // when / then
            assertThatThrownBy(() -> authService.authenticateUser(loginRequest()))
                    .isInstanceOf(EmailNotVerifiedException.class);

            // token nie powinien zostać wygenerowany
            verifyNoInteractions(jwtUtils);
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // registerUser
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("registerUser()")
    class RegisterUser {

        private SignupRequest signupRequest() {
            SignupRequest req = new SignupRequest();
            req.setUsername("newuser");
            req.setEmail("newuser@example.com");
            req.setPassword("Password1!");
            req.setName("Jan");
            req.setSurname("Kowalski");
            return req;
        }

        @Test
        @DisplayName("sukces → zapisuje nieaktywnego usera i wysyła token weryfikacyjny mailem")
        void shouldSaveInactiveUnverifiedUserAndSendVerificationEmail() {
            // given
            UserTokenEntity verificationToken = UserTokenEntity.builder()
                    .id(1L).token("token-xyz")
                    .type(TokenTypeEnum.EMAIL_VERIFICATION)
                    .expiresAt(Instant.now().plusSeconds(3600))
                    .build();

            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
            when(encoder.encode("Password1!")).thenReturn("hashed-pwd");
            when(roleRepository.findByName(ERole.ROLE_USER))
                    .thenReturn(Optional.of(new Role(ERole.ROLE_USER)));
            when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(userTokenService.createToken(any(), eq(TokenTypeEnum.EMAIL_VERIFICATION)))
                    .thenReturn(verificationToken);

            // when
            authService.registerUser(signupRequest());

            // then – kluczowe asercje bezpieczeństwa: user musi być nieaktywny do czasu weryfikacji
            ArgumentCaptor<UserEntity> captor = ArgumentCaptor.forClass(UserEntity.class);
            verify(userRepository).save(captor.capture());
            UserEntity saved = captor.getValue();

            assertThat(saved.getEmailVerified()).isFalse();
            assertThat(saved.getIsActive()).isFalse();
            assertThat(saved.getPassword()).isEqualTo("hashed-pwd"); // hasło zahashowane, nie plain-text

            verify(emailService).sendVerificationEmail("newuser@example.com", verificationToken);
        }

        @Test
        @DisplayName("zduplikowany username → rzuca UserAlreadyExistsException, nie persystuje")
        void shouldThrowWhenUsernameAlreadyTaken() {
            // given
            when(userRepository.existsByUsername("newuser")).thenReturn(true);

            // when / then
            assertThatThrownBy(() -> authService.registerUser(signupRequest()))
                    .isInstanceOf(UserAlreadyExistsException.class);

            verify(userRepository, never()).save(any());
            verifyNoInteractions(emailService);
        }

        @Test
        @DisplayName("zduplikowany email → rzuca UserAlreadyExistsException, nie persystuje")
        void shouldThrowWhenEmailAlreadyInUse() {
            // given
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("newuser@example.com")).thenReturn(true);

            // when / then
            assertThatThrownBy(() -> authService.registerUser(signupRequest()))
                    .isInstanceOf(UserAlreadyExistsException.class);

            verify(userRepository, never()).save(any());
            verifyNoInteractions(emailService);
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // refreshToken
    // ═════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("refreshToken()")
    class RefreshToken {

        @Test
        @DisplayName("poprawny refresh token → zwraca nowy access token z przyszłą datą wygaśnięcia")
        void shouldReturnNewAccessTokenForValidRefreshToken() {
            // given
            Claims claims = mock(Claims.class);
            UserEntity user = activeVerifiedUser();

            when(jwtUtils.validateToken("valid-refresh")).thenReturn(claims);
            when(claims.getSubject()).thenReturn("testuser");
            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
            when(jwtUtils.generateJwtToken(eq("testuser"), any())).thenReturn("new-access-token");

            // when
            AuthService.RefreshResult result = authService.refreshToken("valid-refresh");

            // then
            assertThat(result.accessToken()).isEqualTo("new-access-token");
            assertThat(result.expiresAt()).isGreaterThan(System.currentTimeMillis());
        }

        @Test
        @DisplayName("wygasły lub podrobiony token → rzuca ResponseStatusException HTTP 401")
        void shouldReturn401ForExpiredOrTamperedRefreshToken() {
            // given
            when(jwtUtils.validateToken("bad-token")).thenThrow(new JwtException("expired"));

            // when / then
            assertThatThrownBy(() -> authService.refreshToken("bad-token"))
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                            .isEqualTo(HttpStatus.UNAUTHORIZED));
        }
    }
}
