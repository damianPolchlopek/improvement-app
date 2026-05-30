package com.improvement_app.workouts.data;

import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExercisePlace;
import com.improvement_app.workouts.entity.enums.ExerciseProgress;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import com.improvement_app.workouts.request.ExerciseRequest;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Builders for workout entities. Persistence is the test's responsibility — this only constructs objects.
 * Counter ensures unique training names (passing the regex in DriveFilesHelper).
 */
public final class WorkoutTestDataFactory {

    private static final AtomicInteger TRAINING_COUNTER = new AtomicInteger(1);

    private WorkoutTestDataFactory() {}

    public static void reset() {
        TRAINING_COUNTER.set(1);
    }

    public static UserEntity user(String username) {
        return UserEntity.builder()
                .username(username)
                .email(username + "@test.local")
                .password("$2a$10$test")
                .name("Test")
                .surname("User")
                .build();
    }

    public static ExerciseSetEntity set(double reps, double weight) {
        return new ExerciseSetEntity(reps, weight);
    }

    public static ExerciseEntity exercise(ExerciseName name, ExerciseType type, ExerciseSetEntity... sets) {
        ExerciseEntity exercise = new ExerciseEntity(
                name, type, ExerciseProgress.NO_CHANGE, new ArrayList<>(Arrays.asList(sets))
        );
        for (ExerciseSetEntity s : sets) {
            s.setExercise(exercise);
        }
        return exercise;
    }

    public static TrainingEntity training(UserEntity user, LocalDate date, ExerciseEntity... exercises) {
        String name = String.format("%03d - %s - %s",
                TRAINING_COUNTER.getAndIncrement(),
                date.format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy")) + "r.",
                exercises.length > 0 ? shortTypeFor(exercises[0].getType()) : "A"
        );

        TrainingEntity training = new TrainingEntity(
                date, name, ExercisePlace.GYM, new ArrayList<>(Arrays.asList(exercises))
        );
        training.setUser(user);
        for (ExerciseEntity e : exercises) {
            e.setTraining(training);
        }
        return training;
    }

    private static String shortTypeFor(ExerciseType type) {
        return switch (type) {
            case SILOWY_A -> "A";
            case SILOWY_B -> "B";
            case HIPERTROFICZNY_C -> "C";
            case HIPERTROFICZNY_D -> "D";
            case KETTLE_K1 -> "K1";
            default -> "A";
        };
    }

    /** Buduje minimalny, walidny request używany w POST /exercises/addTraining. */
    public static ExerciseRequest request(ExerciseType type, ExerciseName name, String reps, String weight) {
        return new ExerciseRequest(
                type.getValue(), ExercisePlace.GYM.getValue(),
                name.getValue(), ExerciseProgress.NO_CHANGE.getValue(),
                LocalDate.now(), reps, weight,
                "001 - 28.05.2024r. - A",
                0
        );
    }
}
