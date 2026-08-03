package com.improvement_app.workouts.services;

import com.improvement_app.workouts.dto.ExerciseSearchCriteria;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.repository.ExerciseEntityRepository;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExerciseService {

    private final ExerciseEntityRepository exerciseRepository;
    private final TrainingTemplateService trainingTemplateService;


    public List<ExerciseEntity> findExercises(Long userId, ExerciseSearchCriteria criteria) {
        String name = blankToNull(criteria.name());
        String trainingName = blankToNull(criteria.trainingName());

        long provided = Stream.of(name, criteria.date(), trainingName)
                .filter(Objects::nonNull)
                .count();

        if (provided != 1) {
            throw new IllegalArgumentException("Podaj dokładnie jedno kryterium: date, name lub trainingName");
        }

        if (criteria.date() != null) {
            return exerciseRepository.findByTrainingUserIdAndTrainingDate(userId, criteria.date());
        }

        if (trainingName != null) {
            return exerciseRepository.findByTrainingUserIdAndTrainingName(userId, trainingName);
        }

        ExerciseName exerciseName = ExerciseName.fromValue(name);
        return exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(userId, exerciseName);
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    @Transactional
    public List<ExerciseEntity> findByNameOrderByDate(Long userId, String name, LocalDate beginDateLD, LocalDate endDateLD) {
        ExerciseName exerciseName = ExerciseName.fromValue(name);

        return exerciseRepository.findByTrainingUserIdAndNameAndTrainingDateBetweenOrderByTrainingDate(
                userId,
                exerciseName,
                beginDateLD,
                endDateLD
        );
    }

    @Transactional
    public List<ExerciseEntity> getATHExercise(Long userId, String trainingTypeShortcut) {
        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

        return trainingTemplate.getExercises().stream()
                .map(exercise -> getMaximumCapacityExercise(userId, exercise.getName()))
                .flatMap(Optional::stream)
                .toList();
    }

    private Optional<ExerciseEntity> getMaximumCapacityExercise(Long userId, String exerciseName) {
        final ExerciseName name = ExerciseName.fromValue(exerciseName);

        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(userId, name);

        if (exercises.isEmpty()) {
            return Optional.empty();
        }

        return exercises.stream()
                .max(Comparator.comparingDouble(exercise -> exercise.getExerciseSets()
                        .stream()
                        .map(ExerciseSetEntity::getCapacity)
                        .reduce(0.0, Double::sum)));
    }

    public List<ExerciseEntity> generateTrainingFromTemplate(Long userId, String trainingTypeShortcut) {
        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

        return trainingTemplate.getExercises().stream()
                .map(exerciseNameEntity -> getLatestExercise(userId, ExerciseName.fromValue(exerciseNameEntity.getName())))
                .toList();
    }

    private ExerciseEntity getLatestExercise(Long userId, ExerciseName exerciseName) {
        return exerciseRepository.findFirstByTrainingUserIdAndNameOrderByTrainingDateDesc(userId, exerciseName)
                .orElseGet(() -> new ExerciseEntity(exerciseName));
    }

}
