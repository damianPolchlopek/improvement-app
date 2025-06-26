package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseEntityRepository extends JpaRepository<ExerciseEntity, Integer> {

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByTrainingUserIdAndTrainingDate(Long userId, LocalDate date);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByTrainingUserIdAndNameAndTrainingDateBetweenOrderByTrainingDate(
            Long userId, ExerciseName name,
            LocalDate beginDate,
            LocalDate endDate
    );

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByTrainingUserIdAndNameOrderByTrainingDateDesc(Long userId, ExerciseName name);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    Optional<ExerciseEntity> findFirstByTrainingUserIdAndNameOrderByTrainingDateDesc(Long userId, ExerciseName name);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByTrainingUserIdAndTrainingName(Long userId, String trainingName);

    @EntityGraph(attributePaths = {"training"})
    ExerciseEntity findTopByTrainingUserIdOrderByTrainingDateDesc(Long userId);

}
