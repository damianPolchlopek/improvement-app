package com.improvement_app.workouts.repository2;

import com.improvement_app.workouts.entity2.TrainingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingEntityRepository extends JpaRepository<TrainingEntity, Integer> {
}
