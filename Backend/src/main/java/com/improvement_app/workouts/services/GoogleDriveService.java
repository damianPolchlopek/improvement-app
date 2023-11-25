package com.improvement_app.workouts.services;

import java.io.IOException;

public interface GoogleDriveService {

    void initApplicationCategories() throws IOException;

    void initApplicationExercises() throws IOException;

    void initApplicationTrainingTemplates() throws IOException;

}
