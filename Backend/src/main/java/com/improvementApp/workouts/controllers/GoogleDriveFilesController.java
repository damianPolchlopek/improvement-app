package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.ApplicationVariables;
import com.improvementApp.workouts.services.GoogleDriveService;
import com.improvementApp.workouts.services.GoogleDriveServiceImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/drive")
public class GoogleDriveFilesController {

    private static final Logger LOGGER = Logger.getLogger(GoogleDriveFilesController.class);
    private final String TRAININGS_FOLDER_NAME = ApplicationVariables.DRIVE_TRAININGS_FOLDER_NAME;

    private final GoogleDriveService googleDriveService;

    @Autowired
    public GoogleDriveFilesController(GoogleDriveServiceImpl googleDriveService) {
        this.googleDriveService = googleDriveService;
    }

    @GetMapping(value = {"/uploadAllExercisesFromDriveToDatabase"}, produces = {"application/json"})
    public @ResponseBody
    List<Exercise> uploadAllExercisesFromDriveToDatabase() throws Exception {
        LOGGER.info("Zapisuje wszystkie cwiczenia do bazy danych");
        return googleDriveService.saveAllExercisesToDB(TRAININGS_FOLDER_NAME);
    }

    @GetMapping(value = {"/getFiles"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> getFiles() throws Exception {
        LOGGER.info("CONTROLLER:    START - get files");
        List<DriveFileItemDTO> result = googleDriveService.getDriveFiles(TRAININGS_FOLDER_NAME);
        LOGGER.info("CONTROLLER:    END - get files");
        return result;
    }

    @GetMapping("/initApplication")
    public void initApplication() throws Exception {
        LOGGER.info("Usuwam i dodaje nowe dane do bazy danych treningowej");
        googleDriveService.initApplicationCategories();
        googleDriveService.initApplicationExercises();
    }

}
