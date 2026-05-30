package com.improvement_app.workouts;

import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static com.improvement_app.workouts.data.WorkoutTestDataFactory.*;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * E2E coverage of StatisticController — happy path z realnymi danymi w DB.
 */
class StatisticControllerE2ETest extends AbstractWorkoutE2ETest {

    @Test
    @DisplayName("GET /exercises/statistic/.../.../.../... zwraca punkty wykresu Weight")
    void shouldReturnChartPoints() throws Exception {
        UserEntity u = persistUser("user1");
        trainingRepository.save(training(
                u,
                LocalDate.of(2024, 1, 10),
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(5.0, 60.0), set(5.0, 70.0)),
                exercise(ExerciseName.DIPY, ExerciseType.SILOWY_A, set(20.0, 40.0))
        ));

        trainingRepository.save(training(
                u,
                LocalDate.of(2024, 1, 20),
                exercise(ExerciseName.POMPKI, ExerciseType.SILOWY_A, set(10.0, 80.0))
        ));

        mockMvc.perform(get("/exercises/statistic/{name}/{type}/{begin}/{end}",
                        ExerciseName.POMPKI.getValue(), "Weight", "01-01-2024", "31-01-2024")
                .with(authentication(authOf(u))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].value").value(65.0))
                .andExpect(jsonPath("$[1].value").value(80.0));
    }
}
