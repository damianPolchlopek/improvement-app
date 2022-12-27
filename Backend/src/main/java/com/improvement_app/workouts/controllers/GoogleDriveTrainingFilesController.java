package com.improvement_app.workouts.controllers;

import com.improvement_app.google_drive.service.GoogleDriveFileService;
import com.improvement_app.google_drive.entity.DriveFileItemDTO;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.ApplicationVariables;
import com.improvement_app.workouts.services.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/drive")
public class GoogleDriveTrainingFilesController {

    private static final Logger LOGGER = Logger.getLogger(GoogleDriveTrainingFilesController.class);
    private static final String TRAININGS_FOLDER_NAME = ApplicationVariables.DRIVE_TRAININGS_FOLDER_NAME;

    private final GoogleDriveService googleDriveService;
    private final GoogleDriveFileService googleDriveFileService;

    @GetMapping(value = {"/uploadAllExercisesFromDriveToDatabase"}, produces = {"application/json"})
    public @ResponseBody
    List<Exercise> uploadAllExercisesFromDriveToDatabase() throws IOException {
        LOGGER.info("Zapisuje wszystkie cwiczenia do bazy danych");
        return googleDriveService.saveAllExercisesToDB(TRAININGS_FOLDER_NAME);
    }

    @GetMapping(value = {"/getFiles"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> getFiles() throws IOException {
        LOGGER.info("Pobieram nazwy plikow treningowych");
        return googleDriveFileService.getDriveFiles(TRAININGS_FOLDER_NAME);
    }

    @Transactional
    @GetMapping("/initApplication")
    public void initApplication() throws IOException {
        LOGGER.info("Usuwam i dodaje nowe dane do bazy danych treningowej");
        googleDriveService.initApplicationCategories();
        googleDriveService.initApplicationExercises();
    }

}
