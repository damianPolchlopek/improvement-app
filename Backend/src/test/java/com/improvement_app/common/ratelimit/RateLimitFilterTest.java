package com.improvement_app.common.ratelimit;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.improvement_app.security.config.SecurityProperties;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link RateLimitFilter} — bez kontekstu Springa, na MockHttpServletRequest.
 * Limity ustawione nisko, żeby szybko je przekraczać.
 */
class RateLimitFilterTest {

    private static final String API_PATH = "/api/v1/trainings";
    private static final String SIGNIN_PATH = "/api/v1/auth/signin";
    private static final String DRIVE_PATH = "/api/v1/drive/initApplication";

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private SecurityProperties.HttpRateLimit config;
    private RateLimitFilter filter;

    @BeforeEach
    void setUp() {
        config = new SecurityProperties.HttpRateLimit();
        config.setGlobalPerSecond(100);
        config.setDefaultPerMinute(3);
        config.setAuthPerMinute(2);
        config.setHeavyPerMinute(1);
        filter = new RateLimitFilter(config, objectMapper);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Przepuszcza żądania poniżej limitu i ustawia X-RateLimit-Remaining")
    void shouldPassRequestsUnderLimit() throws Exception {
        MockHttpServletResponse first = send("GET", API_PATH, "10.0.0.1");
        MockHttpServletResponse second = send("GET", API_PATH, "10.0.0.1");

        assertThat(first.getStatus()).isEqualTo(200);
        assertThat(first.getHeader(RateLimitFilter.REMAINING_HEADER)).isEqualTo("2");
        assertThat(second.getHeader(RateLimitFilter.REMAINING_HEADER)).isEqualTo("1");
    }

    @Test
    @DisplayName("Po przekroczeniu limitu zwraca 429 z JSON-em, Retry-After i nie woła dalszego łańcucha")
    void shouldRejectWith429WhenLimitExceeded() throws Exception {
        sendTimes(3, "GET", API_PATH, "10.0.0.1");

        MockFilterChain chain = new MockFilterChain();
        MockHttpServletResponse response = send("GET", API_PATH, "10.0.0.1", chain);

        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(chain.getRequest()).as("łańcuch filtrów nie powinien zostać wywołany").isNull();
        assertThat(response.getContentType()).startsWith("application/json");
        assertThat(response.getCharacterEncoding()).isEqualToIgnoringCase("UTF-8");
        assertThat(Long.parseLong(response.getHeader("Retry-After"))).isBetween(1L, 60L);
        assertThat(response.getHeader(RateLimitFilter.REMAINING_HEADER)).isEqualTo("0");

        JsonNode body = objectMapper.readTree(response.getContentAsString());
        assertThat(body.get("code").asText()).isEqualTo("RATE_LIMIT_EXCEEDED");
        assertThat(body.get("message").asText()).isEqualTo("Zbyt wiele żądań, spróbuj za chwilę.");
        assertThat(body.hasNonNull("timestamp")).isTrue();
    }

    @Test
    @DisplayName("Różne IP mają osobne limity")
    void shouldLimitEachIpSeparately() throws Exception {
        sendTimes(3, "GET", API_PATH, "10.0.0.1");

        assertThat(send("GET", API_PATH, "10.0.0.1").getStatus()).isEqualTo(429);
        assertThat(send("GET", API_PATH, "10.0.0.2").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Zalogowani użytkownicy za tym samym IP mają osobne limity")
    void shouldLimitAuthenticatedUsersSeparately() throws Exception {
        authenticateAs("jan");
        sendTimes(3, "GET", API_PATH, "10.0.0.1");
        assertThat(send("GET", API_PATH, "10.0.0.1").getStatus()).isEqualTo(429);

        authenticateAs("anna");
        assertThat(send("GET", API_PATH, "10.0.0.1").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Endpointy logowania mają osobny, ostrzejszy limit i nie zużywają limitu zwykłego API")
    void shouldApplyStricterSeparateLimitForAuthEndpoints() throws Exception {
        sendTimes(2, "POST", SIGNIN_PATH, "10.0.0.1");

        assertThat(send("POST", SIGNIN_PATH, "10.0.0.1").getStatus()).isEqualTo(429);
        assertThat(send("GET", API_PATH, "10.0.0.1").getHeader(RateLimitFilter.REMAINING_HEADER))
                .as("limit zwykłego API nietknięty").isEqualTo("2");
    }

    @Test
    @DisplayName("Limit logowania liczony per IP, nawet dla zalogowanego użytkownika")
    void shouldKeyAuthEndpointsByIpEvenWhenAuthenticated() throws Exception {
        authenticateAs("jan");
        sendTimes(2, "POST", SIGNIN_PATH, "10.0.0.1");

        authenticateAs("anna");
        assertThat(send("POST", SIGNIN_PATH, "10.0.0.1").getStatus()).isEqualTo(429);
    }

    @Test
    @DisplayName("Endpointy Google Drive mają własny limit")
    void shouldApplyHeavyLimitForDriveEndpoints() throws Exception {
        assertThat(send("GET", DRIVE_PATH, "10.0.0.1").getStatus()).isEqualTo(200);
        assertThat(send("GET", DRIVE_PATH, "10.0.0.1").getStatus()).isEqualTo(429);
        assertThat(send("GET", API_PATH, "10.0.0.1").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Odrzucone żądania jednego klienta nie wyczerpują limitu globalnego dla innych")
    void shouldNotDrainGlobalBucketWithRejectedRequests() throws Exception {
        config.setGlobalPerSecond(5);
        filter = new RateLimitFilter(config, objectMapper);

        sendTimes(20, "GET", API_PATH, "10.0.0.1"); // 3 przechodzą, 17 odrzuconych per IP

        assertThat(send("GET", API_PATH, "10.0.0.2").getStatus()).isEqualTo(200);
        assertThat(send("GET", API_PATH, "10.0.0.3").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Po wyczerpaniu limitu globalnego zwraca 429 z komunikatem o obciążeniu serwera")
    void shouldRejectWhenGlobalLimitExceeded() throws Exception {
        config.setGlobalPerSecond(2);
        filter = new RateLimitFilter(config, objectMapper);

        send("GET", API_PATH, "10.0.0.1");
        send("GET", API_PATH, "10.0.0.2");
        MockHttpServletResponse response = send("GET", API_PATH, "10.0.0.3");

        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(objectMapper.readTree(response.getContentAsString()).get("message").asText())
                .isEqualTo("Zbyt duże obciążenie serwera, spróbuj później.");
    }

    @Test
    @DisplayName("Pomija preflight OPTIONS, actuator i websockety")
    void shouldSkipExcludedRequests() throws Exception {
        for (String[] request : List.of(
                new String[]{"OPTIONS", API_PATH},
                new String[]{"GET", "/actuator/health"},
                new String[]{"GET", "/ws/info"})) {
            sendTimes(10, request[0], request[1], "10.0.0.1");
            MockHttpServletResponse response = send(request[0], request[1], "10.0.0.1");
            assertThat(response.getStatus()).as(request[0] + " " + request[1]).isEqualTo(200);
            assertThat(response.getHeader(RateLimitFilter.REMAINING_HEADER)).isNull();
        }
        assertThat(send("GET", API_PATH, "10.0.0.1").getHeader(RateLimitFilter.REMAINING_HEADER))
                .as("pominięte żądania nie zużyły limitu").isEqualTo("2");
    }

    @Test
    @DisplayName("Wyłączony w konfiguracji przepuszcza wszystko")
    void shouldPassEverythingWhenDisabled() throws Exception {
        config.setEnabled(false);

        sendTimes(10, "GET", API_PATH, "10.0.0.1");

        assertThat(send("GET", API_PATH, "10.0.0.1").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Uwzględnia context path przy dopasowaniu ścieżek")
    void shouldMatchPathsWithContextPath() throws Exception {
        MockHttpServletRequest request = request("POST", "/app" + SIGNIN_PATH, "10.0.0.1");
        request.setContextPath("/app");

        assertThat(filter.resolveTier(SIGNIN_PATH)).isEqualTo(RequestTier.AUTH);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        assertThat(response.getHeader(RateLimitFilter.REMAINING_HEADER)).as("tier AUTH: 2 - 1").isEqualTo("1");
    }

    private void authenticateAs(String username) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                username, null, List.of(new SimpleGrantedAuthority("ROLE_USER"))));
    }

    private void sendTimes(int times, String method, String path, String ip) throws Exception {
        for (int i = 0; i < times; i++) {
            send(method, path, ip);
        }
    }

    private MockHttpServletResponse send(String method, String path, String ip) throws Exception {
        return send(method, path, ip, new MockFilterChain());
    }

    private MockHttpServletResponse send(String method, String path, String ip, MockFilterChain chain) throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request(method, path, ip), response, chain);
        return response;
    }

    private static MockHttpServletRequest request(String method, String path, String ip) {
        MockHttpServletRequest request = new MockHttpServletRequest(method, path);
        request.setRemoteAddr(ip);
        return request;
    }
}
