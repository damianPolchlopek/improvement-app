package com.improvement_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication
@EnableJpaRepositories(basePackages = {
        "com.improvement_app.food.infrastructure",
        "com.improvement_app.security.repository",
        "com.improvement_app.parser.repository",
        "com.improvement_app.workouts.repository",
})
@EnableMongoRepositories(basePackages = {
        "com.improvement_app.other.weekly.repository",
        "com.improvement_app.other.daily.repository",
        "com.improvement_app.shopping.repository",
})
@EnableJpaAuditing
public class ImprovementAppBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ImprovementAppBackendApplication.class, args);
    }
}
