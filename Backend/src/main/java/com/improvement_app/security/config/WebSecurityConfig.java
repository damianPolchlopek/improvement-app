package com.improvement_app.security.config;

import com.improvement_app.security.jwt.AuthEntryPointJwt;
import com.improvement_app.security.jwt.AuthTokenFilter;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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
                        // ====== WEBSOCKET ENDPOINTS - DODANE! ======
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/ws/info/**").permitAll()
                        .requestMatchers("/sockjs-node/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        // Publiczne endpointy
                        .requestMatchers("/api/auth/**").permitAll()
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
                "http://localhost:3000",
                "http://localhost:8080",
                "http://localhost:24568",
                "https://mutarexx.smallhost.pl",
                "https://mutarexx.smallhost.pl:*" // Wildcard dla portów
        ));

        // Dozwolone metody HTTP
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Dozwolone nagłówki
        configuration.setAllowedHeaders(Arrays.asList("*"));

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