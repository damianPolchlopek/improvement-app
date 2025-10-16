package com.improvement_app.food;

import com.improvement_app.food.config.PermitAllSecurityConfig;
import com.improvement_app.food.config.TestContainersConfiguration;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(value = {TestContainersConfiguration.class, PermitAllSecurityConfig.class})
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
public abstract class AbstractE2ETest {

    @LocalServerPort
    protected int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
//        RestAssured.basePath = "/api";
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }
}
