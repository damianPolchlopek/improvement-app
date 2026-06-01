package com.improvement_app.workouts;

import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.workouts.converters.TrainingTypeConverter;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

import static com.improvement_app.workouts.data.WorkoutTestDataFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * E2E coverage of ExerciseController — pięć kanonicznych scenariuszy.
 */
class ExerciseControllerE2ETest extends AbstractWorkoutE2ETest {

    // ─── Happy path POST /addTraining ────────────────────────
    @Test
    @DisplayName("POST /addTraining: zapisuje trening do DB + uploaduje na Google Drive")
    void shouldPersistTrainingAndUploadToDrive() throws Exception {
        UserEntity u = persistUser("user1");
        seedPreviousTraining(u);  // generateFileName potrzebuje treningu z nazwą pasującą do regex
        when(filePathService.getExcelPath(any())).thenReturn(System.getProperty("java.io.tmpdir") + "/test.xlsx");

        String body = objectMapper.writeValueAsString(List.of(
                request(ExerciseType.SILOWY_A, ExerciseName.POMPKI, "10/8/6", "80/82.5/85")
        ));

        mockMvc.perform(post("/exercises/addTraining")
                .with(authentication(authOf(u)))
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").exists());

        verify(googleDriveFileService).uploadFile(any(), any(File.class), any());
        assertThat(trainingRepository.findAll())
                .anySatisfy(t -> assertThat(t.getUser().getId()).isEqualTo(u.getId()));
    }

    // ─── Drive failure → no DB save (Drive = source of truth) ────
    @Test
    @DisplayName("POST /addTraining: gdy Google Drive padnie, w DB nie pojawia się trening")
    void shouldNotPersistWhenDriveFails() throws Exception {
        UserEntity u = persistUser("user1");
        seedPreviousTraining(u);
        when(filePathService.getExcelPath(any())).thenReturn(System.getProperty("java.io.tmpdir") + "/test.xlsx");
        doThrow(new RuntimeException("Drive 503")).when(googleDriveFileService).uploadFile(any(), any(), any());

        long countBefore = trainingRepository.count();

        String body = objectMapper.writeValueAsString(List.of(
                request(ExerciseType.SILOWY_A, ExerciseName.POMPKI, "10/8/6", "80/82.5/85")
        ));

        mockMvc.perform(post("/exercises/addTraining")
                .with(authentication(authOf(u)))
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().is5xxServerError());

        assertThat(trainingRepository.count()).isEqualTo(countBefore);
    }

    // ─── Happy path GET /date/{date} ─────────────────────────
    @Test
    @DisplayName("GET /exercises/date/{date}: zwraca ćwiczenia z podanej daty")
    void shouldReturnExercisesForDate() throws Exception {
        UserEntity u = persistUser("user1");
        LocalDate date = LocalDate.of(2024, 1, 15);
        trainingRepository.save(training(
                u,
                date,
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 80.0))
        ));

        mockMvc.perform(get("/exercises/date/2024-01-15")
                .with(authentication(authOf(u))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").exists());
    }

    // ─── User isolation (kanoniczny test izolacji dla modułu) ────
    @Test
    @DisplayName("GET /exercises/trainingName: User A nie widzi treningów Usera B")
    void shouldNotLeakTrainingsAcrossUsers() throws Exception {
        UserEntity userA = persistUser("userA");
        UserEntity userB = persistUser("userB");

        trainingRepository.save(training(userA, LocalDate.of(2024, 1, 10),
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 80.0))));
        trainingRepository.save(training(userA, LocalDate.of(2024, 1, 12),
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 82.5))));
        for (int i = 0; i < 3; i++) {
            trainingRepository.save(training(userB, LocalDate.of(2024, 2, 1).plusDays(i),
                    exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 90.0))));
        }

        mockMvc.perform(get("/exercises/trainingName")
                .with(authentication(authOf(userA)))
                .param("page", "0").param("size", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[*]", everyItem(not(containsString("02.2024")))));

        mockMvc.perform(get("/exercises/trainingName")
                .with(authentication(authOf(userB)))
                .param("page", "0").param("size", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(3));
    }

    // ─── Happy path GET /trainingType/{type} ────────────────
    @Test
    @DisplayName("GET /exercises/trainingType/{type}: zwraca ćwiczenia z szablonu z ostatnimi wykonaniami")
    void shouldReturnLatestExercisesPerTemplateEntry() throws Exception {
        UserEntity u = persistUser("user1");
        persistTemplate(TrainingTypeConverter.toTrainingTemplate("A"), ExerciseName.POMPKI);
        trainingRepository.save(training(u, LocalDate.of(2024, 1, 15),
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 80.0))));

        mockMvc.perform(get("/exercises/trainingType/A")
                .with(authentication(authOf(u))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isNotEmpty())
                .andExpect(jsonPath("$.content[0].name").value(ExerciseName.POMPKI.getValue()));
    }

    // ─── Helpers ──────────────────────────────────────────────────

    private void seedPreviousTraining(UserEntity u) {
        trainingRepository.save(training(u, LocalDate.now().minusDays(1),
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 80.0))));
    }
}
