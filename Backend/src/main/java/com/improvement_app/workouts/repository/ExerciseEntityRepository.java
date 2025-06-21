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
    List<ExerciseEntity> findByTraining_Date(LocalDate date);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByNameAndTraining_DateBetweenOrderByTraining_Date(
            ExerciseName name,
            LocalDate beginDate,
            LocalDate endDate
    );

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByNameOrderByTraining_DateDesc(ExerciseName exerciseName);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    Optional<ExerciseEntity> findFirstByNameOrderByTraining_DateDesc(ExerciseName name);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByTrainingName(String trainingName);

    @EntityGraph(attributePaths = {"training"})
    ExerciseEntity findTopByOrderByTrainingDateDesc();

}
