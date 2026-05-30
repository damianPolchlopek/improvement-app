package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.services.ExerciseService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Pure unit test — wywołuje metodę kontrolera bezpośrednio, bez Springa, bez MockMvc.
 *
 * kontroler zamienia '_' na ' ' w path parameter przed wywołaniem serwisu.
 *
 * Dlaczego unit zamiast @WebMvcTest slice:
 * Main class ma @EnableJpaRepositories + @EnableJpaAuditing + @EnableMongoRepositories,
 * co wymaga EntityManager + MongoTemplate. @WebMvcTest tych autoconfigów nie ładuje
 * → context fail. Slice ma sens tylko w aplikacjach które te @Enable mają w osobnej konfiguracji.
 * Tu logika to jedna linijka — pure unit ją w pełni pokrywa.
 */
@ExtendWith(MockitoExtension.class)
class ExerciseControllerTest {

    private static final Long USER_ID = 42L;

    @Mock ExerciseService exerciseService;
    @InjectMocks ExerciseController controller;

    @Test
    @DisplayName("getExercisesByTrainingName zamienia '_' na ' ' zanim wywoła serwis")
    void shouldReplaceUnderscoresWithSpacesBeforeCallingService() {
        // Mock zwraca pustą listę — kontroler i tak ma policzyć .stream().map() i odda ListResponse
        when(exerciseService.findByTrainingNameOrderByIndex(eq(USER_ID), any()))
                .thenReturn(List.of());

        controller.getExercisesByTrainingName("001_-_28.05.2024r._-_A", USER_ID);

        ArgumentCaptor<String> nameCaptor = ArgumentCaptor.forClass(String.class);
        verify(exerciseService).findByTrainingNameOrderByIndex(eq(USER_ID), nameCaptor.capture());

        assertThat(nameCaptor.getValue())
                .as("Underscore z path param zostały zamienione na spacje")
                .isEqualTo("001 - 28.05.2024r. - A")
                .doesNotContain("_");
    }
}
