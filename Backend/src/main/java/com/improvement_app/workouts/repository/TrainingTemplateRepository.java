package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.TrainingTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainingTemplateRepository extends MongoRepository<TrainingTemplate, String> {

    TrainingTemplate findByName(String name);

}
