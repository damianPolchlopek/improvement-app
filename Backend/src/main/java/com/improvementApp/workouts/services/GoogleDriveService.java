package com.improvementApp.workouts.services;

import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.entity.Exercise;

import java.io.IOException;
import java.util.List;

public interface GoogleDriveService {
    List<DriveFileItemDTO> getDriveFiles(final String folderName) throws Exception;

    void downloadFile(final DriveFileItemDTO file) throws IOException;

    List<Exercise> saveAllExercisesToDB(final String folderName) throws Exception;

    void uploadFileInFolder(final String folderName,
                            final java.io.File fileToUpload,
                            final String fileName) throws Exception;

    String generateFileName(List<Exercise> exercises);

    void initApplicationCategories() throws Exception;

    void initApplicationExercises() throws Exception;
}
