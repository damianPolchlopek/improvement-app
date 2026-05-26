package com.improvement_app.security.config;

import com.improvement_app.security.jwt.AuthEntryPointJwt;
import com.improvement_app.security.jwt.AuthTokenFilter;
import com.improvement_app.security.oauth2.CustomOidcUserService;
import com.improvement_app.security.oauth2.OAuth2FailureHandler;
import com.improvement_app.security.oauth2.OAuth2SuccessHandler;
import com.improvement_app.security.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Włącza @PreAuthorize
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthEntryPointJwt unauthorizedHandler;
    private final SecurityProperties securityProperties;
    private final PasswordEncoder passwordEncoder;
    private final CustomOidcUserService customOidcUserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS - używamy własną konfigurację zamiast zewnętrznej klasy
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // CSRF - wyłączamy dla REST API
                .csrf(AbstractHttpConfigurer::disable)

                // Obsługa wyjątków
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(unauthorizedHandler))

                // Sesje - STATELESS dla JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // AUTORYZACJA - TO JEST NAJWAŻNIEJSZE!
                .authorizeHttpRequests(auth -> auth
                        // OAuth2
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()

                        // ====== WEBSOCKET ENDPOINTS ======
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/ws/info/**").permitAll()
                        .requestMatchers("/sockjs-node/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        // Publiczne endpointy
                        .requestMatchers("/api/auth/signin").permitAll()
                        .requestMatchers("/api/auth/signup").permitAll()
                        .requestMatchers("/api/auth/refresh-token").permitAll()
                        .requestMatchers("/api/auth/logout").permitAll()
                        .requestMatchers("/api/auth/verify-email").permitAll()
                        .requestMatchers("/api/auth/resend-verification").permitAll()
                        .requestMatchers("/api/test/all").permitAll()

                        // Swagger/OpenAPI - jeśli używasz
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/v2/api-docs/**"
                        ).permitAll()

                        // Endpointy wymagające autoryzacji
                        .requestMatchers(HttpMethod.GET, "/api/test/user")
                        .hasAnyRole("USER", "MODERATOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/test/admin")
                        .hasRole("ADMIN")

                        // WSZYSTKIE INNE REQUESTY WYMAGAJĄ AUTORYZACJI!
                        .anyRequest().authenticated()
                )

                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'self'; " +
                                "script-src 'self' 'unsafe-inline'; " +
                                "style-src 'self' 'unsafe-inline'; " +
                                "img-src 'self' data:; " +
                                "font-src 'self'; " +
                                "connect-src 'self' ws: wss:; " +
                                "frame-ancestors 'self'"
                        ))
                )

                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(info -> info.oidcUserService(customOidcUserService))
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler(oAuth2FailureHandler)
                );

        // Dodanie naszego filtra JWT
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Dozwolone źródła - LEPIEJ PRZEZ PROPERTIES!
        configuration.setAllowedOriginPatterns(Arrays.asList(
                securityProperties.getCors().getAllowedOrigins()
        ));

        // Dozwolone metody HTTP
        configuration.setAllowedMethods(Arrays.asList(
                securityProperties.getCors().getAllowedMethods()
        ));

        // Dozwolone nagłówki
        configuration.setAllowedHeaders(Arrays.asList(
                securityProperties.getCors().getAllowedHeaders()
        ));

        // Czy pozwalać na credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true); // ZMIANA: true dla JWT!

        // Maksymalny czas cache dla preflight requests
        configuration.setMaxAge(3600L);

        // Które nagłówki response mogą być odczytane przez browser
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}