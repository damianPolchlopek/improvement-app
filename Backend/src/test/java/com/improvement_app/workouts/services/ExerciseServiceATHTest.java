package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import com.improvement_app.workouts.repository.ExerciseEntityRepository;
import com.improvement_app.workouts.repository.TrainingEntityRepository;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static com.improvement_app.workouts.data.WorkoutTestDataFactory.datedExercise;
import static com.improvement_app.workouts.data.WorkoutTestDataFactory.set;
import static com.improvement_app.workouts.data.WorkoutTestDataFactory.template;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * Unit test zamiast E2E — logika wyboru max-capacity ATH.
 * Mockito tylko, brak Springa, brak DB.
 *
 * getATHExercise wybiera ćwiczenie o największej sumarycznej pojemności (suma rep*weight)
 * dla każdego ćwiczenia z szablonu.
 */
@ExtendWith(MockitoExtension.class)
class ExerciseServiceATHTest {

    private static final Long USER_ID = 1L;

    @Mock ExerciseEntityRepository exerciseRepository;
    @Mock TrainingEntityRepository trainingRepository;
    @Mock UserRepository userRepository;
    @Mock TrainingTemplateService trainingTemplateService;
    @Mock GoogleDriveFileService googleDriveFileService;
    @Mock FilePathService filePathService;

    @InjectMocks ExerciseService exerciseService;

    @Test
    @DisplayName("getATHExercise zwraca wykonanie o najwyższym sumarycznym capacity (suma rep*weight)")
    void shouldReturnExerciseWithMaxTotalCapacity() {
        TrainingTemplateEntity templateA = template("Siłowy#1-A", ExerciseName.POMPKI);
        when(trainingTemplateService.getTrainingTemplate(eq("A"))).thenReturn(templateA);

        // 3 wykonania POMPKI:
        //  - 2024-01-10: 10×60 + 8×60 = 1080
        //  - 2024-01-15: 10×80 + 8×80 = 1440  ← ATH
        //  - 2024-01-20: 12×50 + 10×50 = 1100
        ExerciseEntity light = datedExercise(LocalDate.of(2024, 1, 10), ExerciseName.POMPKI, ExerciseType.SILOWY_A,
                set(10.0, 60.0), set(8.0, 60.0));
        ExerciseEntity ath   = datedExercise(LocalDate.of(2024, 1, 15), ExerciseName.POMPKI, ExerciseType.SILOWY_A,
                set(10.0, 80.0), set(8.0, 80.0));
        ExerciseEntity mid   = datedExercise(LocalDate.of(2024, 1, 20), ExerciseName.POMPKI, ExerciseType.SILOWY_A,
                set(12.0, 50.0), set(10.0, 50.0));

        when(exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(
                eq(USER_ID), eq(ExerciseName.POMPKI)))
                .thenReturn(List.of(light, ath, mid));

        List<ExerciseEntity> result = exerciseService.getATHExercise(USER_ID, "A");

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isSameAs(ath);
        double total = result.get(0).getExerciseSets().stream()
                .mapToDouble(s -> s.getRep() * s.getWeight()).sum();
        assertThat(total).isEqualTo(1440.0);
    }

    @Test
    @DisplayName("Gdy user nigdy nie robił ćwiczenia z szablonu — wynik nie zawiera tego ćwiczenia")
    void shouldSkipExercisesNeverPerformed() {
        TrainingTemplateEntity templateA = template("Siłowy#1-A", ExerciseName.POMPKI, ExerciseName.DIPY);
        when(trainingTemplateService.getTrainingTemplate(eq("A"))).thenReturn(templateA);

        // User zrobił tylko POMPKI, nie DIPY
        ExerciseEntity pompki = datedExercise(LocalDate.of(2024, 1, 15), ExerciseName.POMPKI, ExerciseType.SILOWY_A,
                set(10.0, 80.0));
        when(exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(
                eq(USER_ID), eq(ExerciseName.POMPKI)))
                .thenReturn(List.of(pompki));
        when(exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(
                eq(USER_ID), eq(ExerciseName.DIPY)))
                .thenReturn(List.of());

        List<ExerciseEntity> result = exerciseService.getATHExercise(USER_ID, "A");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo(ExerciseName.POMPKI);
    }
}
