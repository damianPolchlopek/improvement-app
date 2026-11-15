package com.improvement_app.security.config;

import com.improvement_app.food.config.TestContainersConfiguration;
import com.improvement_app.security.services.EmailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * /actuator/health musi być publiczny (sprawdza go deploy.sh bez logowania),
 * ale bez szczegółów, a pozostałe endpointy actuatora - tylko po zalogowaniu.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestContainersConfiguration.class)
@ActiveProfiles("test")
@DisplayName("Actuator security")
class ActuatorSecurityIntegrationTest {

    @Autowired private MockMvc mockMvc;

    @MockitoBean private EmailService emailService;

    @Test
    @DisplayName("GET /actuator/health bez logowania → 200 UP, bez szczegółów")
    void healthShouldBePublicWithoutDetails() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.components").doesNotExist());
    }

    @Test
    @DisplayName("GET /actuator/metrics bez logowania → 401")
    void otherActuatorEndpointsShouldRequireLogin() throws Exception {
        mockMvc.perform(get("/actuator/metrics"))
                .andExpect(status().isUnauthorized());
    }
}
