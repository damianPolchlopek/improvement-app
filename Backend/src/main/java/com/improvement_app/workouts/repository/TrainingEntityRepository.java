package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingEntityRepository extends JpaRepository<TrainingEntity, Integer> {

    Page<TrainingEntity> findAllByOrderByDateDesc(Pageable page);

    @EntityGraph(attributePaths = {"exercises", "exercises.exerciseSets"})
    Page<TrainingEntity> findDistinctByExercisesTypeOrderByDateDesc(ExerciseType exerciseType, Pageable page);


}
