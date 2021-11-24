package com.improvementApp.workouts.repository;

import com.improvementApp.workouts.entity.TrainingNameList;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AllTrainingNamesRepository extends MongoRepository<TrainingNameList, String> {
}
