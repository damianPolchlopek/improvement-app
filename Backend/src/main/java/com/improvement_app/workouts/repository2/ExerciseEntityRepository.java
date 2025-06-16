package com.improvement_app.workouts.repository2;

import com.improvement_app.workouts.entity2.ExerciseEntity;
import com.improvement_app.workouts.entity2.enums.ExerciseName;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExerciseEntityRepository extends JpaRepository<ExerciseEntity, Integer> {

    List<ExerciseEntity> findByTraining_Date(LocalDate date);

    List<ExerciseEntity> findByTrainingNameIn(List<String> trainingNames);

    @EntityGraph(attributePaths = {"training", "exerciseSets"})
    List<ExerciseEntity> findByNameAndTraining_DateBetweenOrderByTraining_Date(
            ExerciseName name,
            Sort sort,
            LocalDate beginDate,
            LocalDate endDate
    );

//    Optional<ExerciseEntity> findFirstByNameOrderByDateDesc(String name);

//    List<ExerciseEntity> findByTrainingNameOrderByIndex(String trainingName);

//    ExerciseEntity findTopByOrderByDateDesc();
}
