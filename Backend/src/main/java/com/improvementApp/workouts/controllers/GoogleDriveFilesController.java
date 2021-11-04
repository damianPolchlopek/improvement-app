package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.services.GoogleDriveService;
import com.improvementApp.workouts.services.GoogleDriveServiceImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class GoogleDriveFilesController {

    private static final Logger LOGGER = Logger.getLogger(GoogleDriveFilesController.class);

    private final GoogleDriveService googleDriveService;

    @Autowired
    public GoogleDriveFilesController(GoogleDriveService googleDriveService) {
        this.googleDriveService = googleDriveService;
    }

    @GetMapping("/getTrainings")
    public @ResponseBody
    List<DriveFileItemDTO> getTrainings() throws Exception {
        LOGGER.info("START       getTrainings");

        GoogleDriveService googleDriveService = new GoogleDriveServiceImpl();
//        final String folderName = "PlikiPliki";
        final String folderName = "PlanMarcela";
//        List<FileItemDTO> result = googleDriveService.listFiles(folderName);
        String id = googleDriveService.getFolderId(folderName);
        System.out.println(id);

        LOGGER.info("END       getTrainings");
        return new ArrayList<>();
    }



}
