package com.improvement_app.common.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.improvement_app.exceptions.ErrorResponse;
import com.improvement_app.security.config.SecurityProperties;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Limituje liczbę żądań HTTP (token bucket, Bucket4j).
 *
 * Działa w łańcuchu Spring Security ZA {@code AuthTokenFilter}, dzięki czemu zna zalogowanego
 * użytkownika. Limity są osobne dla każdego poziomu (tier) i klucza:
 *  • AUTH    — logowanie/rejestracja/odświeżanie tokena, zawsze per IP (ochrona przed brute force)
 *  • HEAVY   — ciężkie operacje (synchronizacja z Google Drive), per użytkownik/IP
 *  • DEFAULT — reszta API, per użytkownik/IP
 *
 * Na końcu sprawdzany jest limit globalny — dopiero po limicie per klucz, żeby żądania
 * odrzucone dla jednego klienta nie zużywały globalnej puli wszystkim pozostałym.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    public static final String REMAINING_HEADER = "X-RateLimit-Remaining";

    private static final List<String> AUTH_PATHS = List.of(
            "/api/v1/auth/signin",
            "/api/v1/auth/signup",
            "/api/v1/auth/refresh-token",
            "/api/v1/auth/resend-verification",
            "/api/v1/auth/verify-email"
    );

    private static final List<String> HEAVY_PATHS = List.of(
            "/api/v1/drive/**"
    );

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/actuator/**",
            "/ws/**",
            "/sockjs-node/**"
    );

    private final SecurityProperties.HttpRateLimit config;
    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final Bucket globalBucket;

    private final Cache<String, Bucket> perKeyBuckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(10))
            .maximumSize(10_000)
            .build();


    public RateLimitFilter(SecurityProperties.HttpRateLimit config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;
        this.globalBucket = newBucket(config.getGlobalPerSecond(), Duration.ofSeconds(1));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!config.isEnabled() || HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }
        return matchesAny(EXCLUDED_PATHS, pathOf(request));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        RequestTier requestTier = resolveTier(pathOf(request));
        String key = requestTier + ":" + resolveClient(request, requestTier); // np. "DEFAULT:user:jan" albo "AUTH:ip:1.2.3.4"
        Bucket bucket = perKeyBuckets.get(key, k -> newBucket(limitFor(requestTier), Duration.ofMinutes(1)));

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            reject(response, probe, "Zbyt wiele żądań, spróbuj za chwilę.");
            return;
        }

        ConsumptionProbe globalProbe = globalBucket.tryConsumeAndReturnRemaining(1);
        if (!globalProbe.isConsumed()) {
            reject(response, globalProbe, "Zbyt duże obciążenie serwera, spróbuj później.");
            return;
        }

        response.setHeader(REMAINING_HEADER, String.valueOf(probe.getRemainingTokens()));
        filterChain.doFilter(request, response);

    }

    RequestTier resolveTier(String path) {
        if (matchesAny(AUTH_PATHS, path)) return RequestTier.AUTH;
        if (matchesAny(HEAVY_PATHS, path)) return RequestTier.HEAVY;
        return RequestTier.DEFAULT;
    }

    private boolean matchesAny(List<String> patterns, String path) {
        return patterns.stream().anyMatch(p -> pathMatcher.match(p, path));
    }

    private static String pathOf(HttpServletRequest request) {
        return request.getRequestURI().substring(request.getContextPath().length());
    }

    private String resolveClient(HttpServletRequest request, RequestTier requestTier) {
        if (requestTier != RequestTier.AUTH) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null &&
                authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken)) {
                return "user:" + authentication.getName();
            }
        }

        return "ip:" + request.getRemoteAddr();
    }

    private static Bucket newBucket(int capacity, Duration period) {
        return Bucket.builder()
                .addLimit(Bandwidth.builder().capacity(capacity).refillGreedy(capacity, period).build())
                .build();
    }

    private int limitFor(RequestTier requestTier) {
        return switch (requestTier) {
            case AUTH -> config.getAuthPerMinute();
            case HEAVY -> config.getHeavyPerMinute();
            case DEFAULT -> config.getDefaultPerMinute();
        };
    }

    private void reject(HttpServletResponse res, ConsumptionProbe probe, String message) throws IOException {
        long retryAfterSeconds = Math.max(1, TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill()) + 1);

        res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        res.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        res.setHeader(REMAINING_HEADER, "0");
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());

        ErrorResponse body = ErrorResponse.builder()
                .code("RATE_LIMIT_EXCEEDED")
                .message(message)
                .timestamp(LocalDateTime.now())
                .details("Spróbuj ponownie za " + retryAfterSeconds + " s.")
                .build();
        objectMapper.writeValue(res.getWriter(), body);

    }


}
