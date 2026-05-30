package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseNameEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseProgress;
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
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * Unit test zamiast E2E — logika wyboru max-capacity ATH.
 * Mockito tylko, brak Springa, brak DB.
 *
 * #19 — getATHExercise wybiera ćwiczenie o największej sumarycznej pojemności (suma rep*weight)
 *       dla każdego ćwiczenia z szablonu.
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
    @DisplayName("[#19] getATHExercise zwraca wykonanie o najwyższym sumarycznym capacity (suma rep*weight)")
    void shouldReturnExerciseWithMaxTotalCapacity() {
        // Template zawiera POMPKI
        TrainingTemplateEntity template = templateWith(ExerciseName.POMPKI);
        when(trainingTemplateService.getTrainingTemplate(eq("A"))).thenReturn(template);

        // 3 wykonania POMPKI:
        //  - 2024-01-10: 10×60 + 8×60 = 1080
        //  - 2024-01-15: 10×80 + 8×80 = 1440  ← ATH
        //  - 2024-01-20: 12×50 + 10×50 = 1100
        ExerciseEntity light = exerciseOn(LocalDate.of(2024, 1, 10), set(10.0, 60.0), set(8.0, 60.0));
        ExerciseEntity ath   = exerciseOn(LocalDate.of(2024, 1, 15), set(10.0, 80.0), set(8.0, 80.0));
        ExerciseEntity mid   = exerciseOn(LocalDate.of(2024, 1, 20), set(12.0, 50.0), set(10.0, 50.0));

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
    @DisplayName("[#19 edge] Gdy user nigdy nie robił ćwiczenia z szablonu — wynik nie zawiera tego ćwiczenia")
    void shouldSkipExercisesNeverPerformed() {
        TrainingTemplateEntity template = templateWith(ExerciseName.POMPKI, ExerciseName.DIPY);
        when(trainingTemplateService.getTrainingTemplate(eq("A"))).thenReturn(template);

        // User zrobił tylko POMPKI, nie DIPY
        ExerciseEntity pompki = exerciseOn(LocalDate.of(2024, 1, 15), set(10.0, 80.0));
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

    // ─── Helpers ────────────────────────────────────────────────

    private ExerciseSetEntity set(double reps, double weight) {
        return new ExerciseSetEntity(reps, weight);
    }

    private ExerciseEntity exerciseOn(LocalDate date, ExerciseSetEntity... sets) {
        ExerciseEntity ex = new ExerciseEntity(
                ExerciseName.POMPKI, ExerciseType.SILOWY_A,
                ExerciseProgress.NO_CHANGE, new ArrayList<>(List.of(sets)));
        TrainingEntity t = new TrainingEntity();
        t.setDate(date);
        ex.setTraining(t);
        return ex;
    }

    private TrainingTemplateEntity templateWith(ExerciseName... names) {
        TrainingTemplateEntity template = new TrainingTemplateEntity("Siłowy#1-A");
        for (ExerciseName n : names) {
            template.addExercise(new ExerciseNameEntity(n.getValue()));
        }
        return template;
    }
}
