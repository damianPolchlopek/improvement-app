package com.improvement_app.workouts.repository2;

import com.improvement_app.workouts.entity2.ExerciseEntity;
import com.improvement_app.workouts.entity2.enums.ExerciseName;
import com.improvement_app.workouts.entity2.enums.ExerciseType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseEntityRepository extends JpaRepository<ExerciseEntity, Integer> {

    List<ExerciseEntity> findByTraining_Date(LocalDate date);

    List<ExerciseEntity> findByTrainingNameIn(List<String> trainingNames);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByNameAndTraining_DateBetweenOrderByTraining_Date(
            ExerciseName name,
            LocalDate beginDate,
            LocalDate endDate
    );

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByNameOrderByTraining_DateDesc(ExerciseName exerciseName);

    Optional<ExerciseEntity> findFirstByNameOrderByTraining_DateDesc(String name);

    List<ExerciseEntity> findByTrainingName(String trainingName);

//    ExerciseEntity findTopByOrderByDateDesc();

    List<ExerciseEntity> findByType(ExerciseType type);

}
