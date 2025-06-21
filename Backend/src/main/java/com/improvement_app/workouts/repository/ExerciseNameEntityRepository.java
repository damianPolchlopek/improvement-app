package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.ExerciseNameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseNameEntityRepository extends JpaRepository<ExerciseNameEntity, Long> {

//    Map<String, ExerciseNameEntity> saveAll(List<ExerciseNameEntity> exerciseNameEntities);
}
