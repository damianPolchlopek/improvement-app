package com.improvement_app.workouts.services;

import com.improvement_app.workouts.dto.DriveFileItemDTO;
import com.improvement_app.workouts.entity.Exercise;

import java.io.IOException;
import java.util.List;

public interface GoogleDriveService {

    List<Exercise> saveAllExercisesToDB(final String folderName) throws IOException;

    List<DriveFileItemDTO> getDriveFiles(final String folderName) throws IOException;

    void initApplicationCategories() throws IOException;

    void initApplicationExercises() throws IOException;

    void deleteTraining(String trainingName) throws IOException;

    void downloadFile(final DriveFileItemDTO file) throws IOException;

    void uploadFileInFolder(final String folderName,
                            final java.io.File fileToUpload,
                            final String fileName) throws IOException;




}
