package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingEntityRepository extends JpaRepository<TrainingEntity, Integer> {

    Page<TrainingEntity> findByUserId(Long userId, Pageable page);

    // @EntityGraph removed: combining collection fetch with Pageable causes in-memory pagination (OOM).
    // @BatchSize(50) on exercises + Hibernate.initialize in service handles batch loading safely.
    Page<TrainingEntity> findDistinctByUserIdAndExercisesTypeOrderByDateDesc(Long userId, ExerciseType exerciseType, Pageable page);

}
