package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;

import java.util.List;

public interface TrainingService {

    List<Exercise> generateTraining(String trainingType);

}
