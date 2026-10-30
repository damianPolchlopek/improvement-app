package com.improvement_app.shopping;

import com.improvement_app.food.config.PermitAllSecurityConfig;
import com.improvement_app.food.config.TestContainersConfiguration;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.security.services.UserDetailsImpl;
import com.improvement_app.shopping.repository.ShoppingItemRepository;
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
 * E2E ShoppingController — zapis do Postgresa i izolacja danych między użytkownikami.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import({TestContainersConfiguration.class, PermitAllSecurityConfig.class})
@ActiveProfiles("test")
class ShoppingControllerE2ETest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ShoppingItemRepository shoppingItemRepository;
    @Autowired private UserRepository userRepository;

    // Sprzątamy też po teście — inne klasy E2E robią userRepository.deleteAll(),
    // a produkty trzymają FK do users.
    @BeforeEach
    @AfterEach
    void cleanDb() {
        shoppingItemRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /shopping/ zapisuje produkt przypisany do zalogowanego użytkownika")
    void shouldSaveItemForCurrentUser() throws Exception {
        UserEntity u = userRepository.save(user("shop1"));

        mockMvc.perform(post("/api/v1/shopping/")
                        .with(authentication(authOf(u)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": " Witamina C ", "category": "PHARMACY"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Witamina C"))
                .andExpect(jsonPath("$.category").value("PHARMACY"))
                .andExpect(jsonPath("$.user").doesNotExist());

        assertThat(shoppingItemRepository.findAll())
                .singleElement()
                .satisfies(i -> assertThat(i.getUser().getId()).isEqualTo(u.getId()));
    }

    @Test
    @DisplayName("POST /shopping/ z kategorią ALL albo pustą nazwą zwraca 400")
    void shouldRejectInvalidItem() throws Exception {
        UserEntity u = userRepository.save(user("shop-invalid"));

        mockMvc.perform(post("/api/v1/shopping/")
                        .with(authentication(authOf(u)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "Chleb", "category": "ALL"}
                                """))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/shopping/")
                        .with(authentication(authOf(u)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": " ", "category": "CLOTHES"}
                                """))
                .andExpect(status().isBadRequest());

        assertThat(shoppingItemRepository.count()).isZero();
    }

    @Test
    @DisplayName("GET /shopping/category/{category} filtruje po kategorii i zwraca tylko własne produkty")
    void shouldReturnOnlyOwnItemsByCategory() throws Exception {
        UserEntity owner = userRepository.save(user("shop-owner"));
        UserEntity other = userRepository.save(user("shop-other"));

        addItem(owner, "Koszula", "CLOTHES");
        addItem(owner, "Ibuprofen", "PHARMACY");
        addItem(other, "Spodnie", "CLOTHES");

        mockMvc.perform(get("/api/v1/shopping/category/CLOTHES").with(authentication(authOf(owner))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Koszula"));

        mockMvc.perform(get("/api/v1/shopping/category/ALL").with(authentication(authOf(owner))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/v1/shopping/category/ALL").with(authentication(authOf(other))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("DELETE /shopping/{id} cudzego produktu zwraca 404 i nic nie usuwa")
    void shouldNotDeleteOtherUsersItem() throws Exception {
        UserEntity owner = userRepository.save(user("shop-owner2"));
        UserEntity attacker = userRepository.save(user("shop-attacker"));
        addItem(owner, "Ładowarka", "ELECTRONICS");
        Long id = shoppingItemRepository.findAll().get(0).getId();

        mockMvc.perform(delete("/api/v1/shopping/{id}", id).with(authentication(authOf(attacker))))
                .andExpect(status().isNotFound());
        assertThat(shoppingItemRepository.count()).isEqualTo(1);

        mockMvc.perform(delete("/api/v1/shopping/{id}", id).with(authentication(authOf(owner))))
                .andExpect(status().isNoContent());
        assertThat(shoppingItemRepository.count()).isZero();
    }

    private void addItem(UserEntity user, String name, String category) throws Exception {
        mockMvc.perform(post("/api/v1/shopping/")
                        .with(authentication(authOf(user)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"" + name + "\", \"category\": \"" + category + "\"}"))
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
