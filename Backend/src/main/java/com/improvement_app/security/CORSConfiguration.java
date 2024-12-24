package com.improvement_app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSConfiguration {

    @Bean
    public WebMvcConfigurer CORSConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                                "http://localhost:3000",
                                "https://mutarexx.smallhost.pl",
                                "https://mutarexx.smallhost.pl:3000",
                                "http://localhost:8080",
                                "http://localhost:24568")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(false); // Brak poświadczeń
            }
        };
    }
}

