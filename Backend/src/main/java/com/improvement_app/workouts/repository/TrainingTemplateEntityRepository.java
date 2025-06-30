package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainingTemplateEntityRepository extends JpaRepository<TrainingTemplateEntity, Long> {

    @EntityGraph(attributePaths = {"exercises"})
    Optional<TrainingTemplateEntity> findByName(String name);

}
