package com.improvementApp.workouts.controllers;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.helpers.ApplicationVariables;
import com.improvementApp.workouts.types.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/test")
public class ExerciseController2 {

    private Drive googleDrive;

    public ExerciseController2(Drive googleDrive) {
        this.googleDrive = googleDrive;
    }

    @GetMapping(value = {"/getFiles2"})
    public File getFiles2() throws Exception {
        String fileId = "15YbJ4S953dWbpMEqh68QsYXlmsIGpBzrOMGUleubEag";
        return googleDrive.files().get(fileId).execute();
//        return googleDrive.files().list();
    }

    @GetMapping(value = {"/getFiles"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> getFiles() throws Exception {
        final String folderId = getFolderId(ApplicationVariables.TRAININGS_FOLDER_NAME);
        System.out.println(folderId);
        final String query = "mimeType='" + MimeType.DRIVE_SHEETS.getType()
                + "' and '" + folderId + "' in parents ";

        Drive.Files.List request = googleDrive
                .files()
                .list()
                .setQ(query);

        final List<File> allFiles = getAllFiles(request);

        final List<DriveFileItemDTO> responseList = allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());

        return responseList;
    }

    private String getFolderId(final String folderName) throws Exception {
        final String query = "mimeType='" + MimeType.DRIVE_FOLDER.getType()
                + "' and name contains '" + folderName + "' ";

        Drive.Files.List request = googleDrive
                .files()
                .list()
                .setQ(query);

        System.out.println("Request: " + request.toString());

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new Exception("Return more than one folder");

        final List<DriveFileItemDTO> responseList = allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());

        System.out.println("List size: " + responseList.size());

        return responseList.get(0).getId();
    }

    private List<File> getAllFiles(final Drive.Files.List request) {
        List<File> result = new ArrayList<>();
        do {
            try {
                FileList files = request.execute();

                result.addAll(files.getFiles());
                request.setPageToken(files.getNextPageToken());
            } catch (IOException e) {
                System.out.println("An error occurred: " + e);
                request.setPageToken(null);
            }
        } while (request.getPageToken() != null &&
                request.getPageToken().length() > 0);

        return result;
    }

}
