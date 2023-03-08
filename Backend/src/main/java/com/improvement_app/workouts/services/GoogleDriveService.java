package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;

import java.io.IOException;
import java.util.List;

public interface GoogleDriveService {

    List<Exercise> saveAllExercisesToDB(final String folderName) throws IOException;

    void initApplicationCategories() throws IOException;

    void initApplicationExercises() throws IOException;

    void initApplicationTrainingTemplates() throws IOException;

    void deleteTraining(String trainingName) throws IOException;

}
