package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.services.GoogleDriveService;
import com.improvementApp.workouts.services.GoogleDriveServiceImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.List;

@RestController
public class GoogleDriveFilesController {

    private static final Logger LOGGER = Logger.getLogger(GoogleDriveFilesController.class);
    private final String TRAININGS_FOLDER_NAME = "PlikiPliki";

    private final GoogleDriveService googleDriveService;

    @Autowired
    public GoogleDriveFilesController(GoogleDriveServiceImpl googleDriveService) {
        this.googleDriveService = googleDriveService;
    }

    @GetMapping(value = {"/saveAllExercises"}, produces = {"application/json"})
    public @ResponseBody
    List<Exercise> saveAllExercises() throws Exception {
        LOGGER.info("Zapisuje wszystkie cwiczenia do bazy danych");
        return googleDriveService.saveAllExercisesToDB(TRAININGS_FOLDER_NAME);
    }

    @GetMapping(value = {"/getFiles"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> getFiles() throws Exception {
        LOGGER.info("Odczytuje pliki z folderu: " + TRAININGS_FOLDER_NAME);
        return googleDriveService.listFiles(TRAININGS_FOLDER_NAME);
    }

    @GetMapping(value = {"/download"}, produces = {"application/json"})
    public void downloadFile() throws Exception {
        final DriveFileItemDTO file = googleDriveService.listFiles(TRAININGS_FOLDER_NAME).get(0);
        LOGGER.info("Pobieram plik");
        googleDriveService.downloadFile(file);
    }

    @GetMapping(value = {"/uploadFile"}, produces = {"application/json"})
    public void upload() throws Exception {
        LOGGER.info("Wrzucam plik na dysk googlea");
        File file = new File("src/main/resources/tmp_files/test.xlsx");
        System.out.println(file.getName());
        googleDriveService.uploadFileInFolder(TRAININGS_FOLDER_NAME, file, "tessssst");

//        String na = googleDriveService.generateFileName(exercises);
//        System.out.println(na);

    }

}
