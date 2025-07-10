package com.improvement_app.security.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();

    @Data
    public static class Jwt {
        private String secret = "defaultSecretKey";
        private long accessTokenExpirationMs = 900_000; // 15 minut
        private long refreshTokenExpirationMs = 259_200_000; // 3 dni
    }

    @Data
    public static class Cors {
        private String[] allowedOrigins = {"http://localhost:3000"};
        private Long maxAge = 3600L;
    }
}
