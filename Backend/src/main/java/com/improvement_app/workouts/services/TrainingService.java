package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;

import java.io.IOException;
import java.util.List;

public interface TrainingService {

    List<Exercise> generateTrainingFromTemplate(String trainingType);

    List<Exercise> addTraining(List<Exercise> exercises) throws IOException;

}
