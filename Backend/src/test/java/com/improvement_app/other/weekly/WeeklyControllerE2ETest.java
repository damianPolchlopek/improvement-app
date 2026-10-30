package com.improvement_app.other.weekly;

import com.improvement_app.food.config.PermitAllSecurityConfig;
import com.improvement_app.food.config.TestContainersConfiguration;
import com.improvement_app.other.weekly.repository.WeeklyRepository;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.security.services.UserDetailsImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static com.improvement_app.workouts.data.WorkoutTestDataFactory.user;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * E2E WeeklyController — zapis do Postgresa i izolacja danych między użytkownikami.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import({TestContainersConfiguration.class, PermitAllSecurityConfig.class})
@ActiveProfiles("test")
class WeeklyControllerE2ETest {

    @Autowired private MockMvc mockMvc;
    @Autowired private WeeklyRepository weeklyRepository;
    @Autowired private UserRepository userRepository;

    // Sprzątamy też po teście — inne klasy E2E robią userRepository.deleteAll(),
    // a wpisy weekly trzymają FK do users.
    @BeforeEach
    @AfterEach
    void cleanDb() {
        weeklyRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /weekly zapisuje wpis z dzisiejszą datą, przypisany do zalogowanego użytkownika")
    void shouldSaveWeeklyRecordForCurrentUser() throws Exception {
        UserEntity u = userRepository.save(user("weekly1"));

        mockMvc.perform(post("/api/v1/weekly")
                        .with(authentication(authOf(u)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": " 82.5 ", "category": "Waga"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("82.5"))
                .andExpect(jsonPath("$.category").value("Waga"))
                .andExpect(jsonPath("$.date").isString())
                .andExpect(jsonPath("$.user").doesNotExist());

        assertThat(weeklyRepository.findAll())
                .singleElement()
                .satisfies(w -> assertThat(w.getUser().getId()).isEqualTo(u.getId()));
    }

    @Test
    @DisplayName("POST /weekly bez nazwy zwraca 400")
    void shouldRejectBlankName() throws Exception {
        UserEntity u = userRepository.save(user("weekly-blank"));

        mockMvc.perform(post("/api/v1/weekly")
                        .with(authentication(authOf(u)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "  ", "category": "Waga"}
                                """))
                .andExpect(status().isBadRequest());

        assertThat(weeklyRepository.count()).isZero();
    }

    @Test
    @DisplayName("GET /weekly/{category} zwraca tylko wpisy zalogowanego użytkownika")
    void shouldReturnOnlyOwnRecords() throws Exception {
        UserEntity owner = userRepository.save(user("weekly-owner"));
        UserEntity other = userRepository.save(user("weekly-other"));

        addRecord(owner, "80");
        addRecord(owner, "81");
        addRecord(other, "95");

        mockMvc.perform(get("/api/v1/weekly/Waga").with(authentication(authOf(owner))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/v1/weekly/Waga").with(authentication(authOf(other))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("95"));
    }

    @Test
    @DisplayName("DELETE /weekly/{id} cudzego wpisu zwraca 404 i nic nie usuwa")
    void shouldNotDeleteOtherUsersRecord() throws Exception {
        UserEntity owner = userRepository.save(user("weekly-owner2"));
        UserEntity attacker = userRepository.save(user("weekly-attacker"));
        addRecord(owner, "80");
        Long id = weeklyRepository.findAll().get(0).getId();

        mockMvc.perform(delete("/api/v1/weekly/{id}", id).with(authentication(authOf(attacker))))
                .andExpect(status().isNotFound());
        assertThat(weeklyRepository.count()).isEqualTo(1);

        mockMvc.perform(delete("/api/v1/weekly/{id}", id).with(authentication(authOf(owner))))
                .andExpect(status().isNoContent());
        assertThat(weeklyRepository.count()).isZero();
    }

    private void addRecord(UserEntity user, String name) throws Exception {
        mockMvc.perform(post("/api/v1/weekly")
                        .with(authentication(authOf(user)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"" + name + "\", \"category\": \"Waga\"}"))
                .andExpect(status().isOk());
    }

    private Authentication authOf(UserEntity user) {
        UserDetailsImpl principal = new UserDetailsImpl(
                user.getId(), user.getUsername(), user.getEmail(),
                user.getPassword(), List.of(), true
        );
        return new UsernamePasswordAuthenticationToken(principal, null, List.of());
    }
}
