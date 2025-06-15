package com.improvement_app.workouts.repository2;

import com.google.api.services.drive.Drive;
import com.improvement_app.workouts.entity2.ExerciseNameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ExerciseNameEntityRepository extends JpaRepository<ExerciseNameEntity, Long> {

//    Map<String, ExerciseNameEntity> saveAll(List<ExerciseNameEntity> exerciseNameEntities);
}
