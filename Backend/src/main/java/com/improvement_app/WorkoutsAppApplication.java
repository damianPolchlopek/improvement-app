package com.improvement_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class WorkoutsAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkoutsAppApplication.class, args);
    }
}
