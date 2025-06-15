package com.improvement_app.workouts.repository2;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity2.ExerciseEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseEntityRepository extends JpaRepository<ExerciseEntity, Integer> {

//    List<ExerciseEntity> findByDateOrderByIndex(LocalDate date);
//
//    List<ExerciseEntity> findByTrainingNameIn(List<String> trainingNames);
//
//    List<ExerciseEntity> findByNameOrderByDate(String name, Sort sort);
//
//    Optional<ExerciseEntity> findFirstByNameOrderByDateDesc(String name);
//
//    List<ExerciseEntity> findByTrainingNameOrderByIndex(String trainingName);
//
//    ExerciseEntity findTopByOrderByDateDesc();
}
