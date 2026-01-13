package com.improvement_app.workouts.controllers;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TestLogController {
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private final DataSource dataSource;

    @GetMapping("/api/debug/hibernate-config")
    public Map<String, Object> getHibernateConfig() {
        Map<String, Object> config = new HashMap<>();

        SessionFactoryImpl sessionFactory = entityManagerFactory.unwrap(SessionFactoryImpl.class);

        // Pobierz wszystkie properties
        Map<String, Object> props = sessionFactory.getProperties();

        config.put("hibernate.jdbc.batch_size", props.get("hibernate.jdbc.batch_size"));
        config.put("hibernate.order_inserts", props.get("hibernate.order_inserts"));
        config.put("hibernate.order_updates", props.get("hibernate.order_updates"));
        config.put("hibernate.jdbc.batch_versioned_data", props.get("hibernate.jdbc.batch_versioned_data"));

        // Sprawdź JDBC URL
        try (Connection conn = dataSource.getConnection()) {
            config.put("jdbcUrl", conn.getMetaData().getURL());
            config.put("driverName", conn.getMetaData().getDriverName());
            config.put("driverVersion", conn.getMetaData().getDriverVersion());
        } catch (SQLException e) {
            config.put("error", e.getMessage());
        }

        return config;
    }
}
