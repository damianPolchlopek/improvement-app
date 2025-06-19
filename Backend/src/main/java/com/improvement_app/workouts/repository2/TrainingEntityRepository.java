package com.improvement_app.workouts.repository2;

import com.improvement_app.workouts.entity2.TrainingEntity;
import com.improvement_app.workouts.entity2.enums.ExerciseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingEntityRepository extends JpaRepository<TrainingEntity, Integer> {

    List<TrainingEntity> findAllByOrderByDateDesc();

    @EntityGraph(attributePaths = {"exercises"})
    Page<TrainingEntity> findDistinctByExercisesTypeOrderByDateDesc(ExerciseType exerciseType, Pageable page);

}
