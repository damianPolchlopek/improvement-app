package com.improvement_app.workouts.repository2;

import com.improvement_app.workouts.entity2.TrainingTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainingTemplateEntityRepository extends JpaRepository<TrainingTemplateEntity, Long> {

    Optional<TrainingTemplateEntity> findByName(String name);

}
