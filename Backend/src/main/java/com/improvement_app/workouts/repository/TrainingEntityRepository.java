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

    // TODO pomyslec o eager pobieranie ExerciseSets, Jak dodaje to w entity do jest exception,
    // zwiazany z kartezjanskim iloczynem
    @EntityGraph(attributePaths = {"exercises"})
    Page<TrainingEntity> findDistinctByExercisesTypeOrderByDateDesc(ExerciseType exerciseType, Pageable page);


}
