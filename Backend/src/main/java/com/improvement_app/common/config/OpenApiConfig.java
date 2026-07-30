package com.improvement_app.common.config;

import com.improvement_app.security.controllers.AuthCookieManager;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * JWT w tej aplikacji leci w httpOnly cookie (AuthTokenFilter), nie w nagłówku Authorization,
 * więc schemat bezpieczeństwa w Swaggerze musi być typu apiKey/cookie, nie HTTP Bearer —
 * inaczej przycisk "Authorize" wyglądałby, że działa, a backend i tak by go ignorował.
 *
 * Uwaga: jeśli w tej samej przeglądarce jesteś już zalogowany do aplikacji, prawdziwe cookie
 * jest httpOnly i przeglądarka nie pozwoli Swagger UI go nadpisać przez JS — "Authorize" zadziała
 * tylko w czystej sesji (np. incognito) bez wcześniejszego logowania na tej domenie.
 */
@Configuration
public class OpenApiConfig {

    private static final String COOKIE_AUTH_SCHEME = "cookieAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes(COOKIE_AUTH_SCHEME, new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name(AuthCookieManager.ACCESS_COOKIE)))
                .addSecurityItem(new SecurityRequirement().addList(COOKIE_AUTH_SCHEME));
    }
}
