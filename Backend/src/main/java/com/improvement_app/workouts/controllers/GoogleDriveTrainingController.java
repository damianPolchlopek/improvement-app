package com.improvement_app.workouts.controllers;

import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.services.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.workouts.TrainingModuleVariables.DRIVE_TRAININGS_FOLDER_NAME;

@RestController
@RequiredArgsConstructor
@RequestMapping("/drive")
public class GoogleDriveTrainingController {

    private static final Logger LOGGER = Logger.getLogger(GoogleDriveTrainingController.class);

    private final GoogleDriveService googleDriveService;
    private final GoogleDriveFileService googleDriveFileService;

    @GetMapping(value = "/uploadAllExercisesFromDriveToDatabase", produces = MediaType.APPLICATION_JSON)
    public @ResponseBody List<Exercise> uploadAllExercisesFromDriveToDatabase() throws IOException {
        LOGGER.info("Zapisuje wszystkie cwiczenia do bazy danych");
        return googleDriveService.saveAllExercisesToDB(DRIVE_TRAININGS_FOLDER_NAME);
    }

    @GetMapping(value = "/getFiles", produces = MediaType.APPLICATION_JSON)
    public @ResponseBody List<DriveFileItemDTO> getFiles() throws IOException {
        LOGGER.info("Pobieram nazwy plikow treningowych");
        return googleDriveFileService.getDriveFiles(DRIVE_TRAININGS_FOLDER_NAME);
    }

    @Transactional
    @GetMapping(value = "/initApplication", produces = MediaType.APPLICATION_JSON)
    public void initApplication() throws IOException {
        LOGGER.info("Usuwam i dodaje nowe dane do bazy danych treningowej");
        googleDriveService.initApplicationCategories();
        googleDriveService.initApplicationExercises();
        googleDriveService.initApplicationTrainingTemplates();
    }

}
