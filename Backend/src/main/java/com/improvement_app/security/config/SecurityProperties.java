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
        private int expirationMs = 86400000; // 24 hours
    }

    @Data
    public static class Cors {
        private String[] allowedOrigins = {"http://localhost:3000"};
        private Long maxAge = 3600L;
    }
}
