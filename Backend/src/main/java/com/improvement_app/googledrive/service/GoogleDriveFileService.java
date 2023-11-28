package com.improvement_app.googledrive.service;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.improvement_app.googledrive.exceptions.GoogleDriveRequestException;
import com.improvement_app.googledrive.types.MimeType;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.exceptions.GoogleDriveFileNotDownloadedException;
import com.improvement_app.googledrive.exceptions.TooMuchGoogleDriveFilesException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoogleDriveFileService {

    private final Drive drive;
    private final FilePathService filePathService;

    public List<DriveFileItemDTO> getDriveFiles(final String folderName) {
        final String folderId = getGoogleDriveObjectId(folderName, MimeType.DRIVE_FOLDER);

        final String query = "mimeType='" + MimeType.DRIVE_SHEETS.getType()
                + "' and '" + folderId + "' in parents ";

        Drive.Files.List request;
        try {
            request = drive
                    .files()
                    .list()
                    .setQ(query);
        } catch (IOException e) {
            throw new GoogleDriveRequestException(e);
        }

        final List<File> allFiles = getAllFiles(request);

        return allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());
    }

    public String getGoogleDriveObjectId(final String googleDriveFileName,
                                          final MimeType type) {
        final String query = "mimeType='" + type.getType()
                + "' and name contains '" + googleDriveFileName + "' ";

        Drive.Files.List request;
        try {
            request = drive
                    .files()
                    .list()
                    .setQ(query);
        } catch (IOException e) {
            throw new GoogleDriveRequestException(e);
        }

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new TooMuchGoogleDriveFilesException("Return more than one folder");

        final List<DriveFileItemDTO> responseList = allFiles.stream()
                .map(DriveFileItemDTO::new)
                .toList();

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
                request.setPageToken(null);
            }
        } while (request.getPageToken() != null &&
                !request.getPageToken().isEmpty());

        return result;
    }

    public void downloadFile(final DriveFileItemDTO file)  {
        final String filePath = filePathService.getExcelPath(file.getName());

        try {
            drive.files().export(file.getId(), MimeType.EXCEL.getType())
                    .executeMediaAndDownloadTo(new FileOutputStream(filePath));
        } catch (IOException e) {
            throw new GoogleDriveFileNotDownloadedException(e);
        }
    }

    public void uploadFile(final String folderName,
                           final java.io.File fileToUpload,
                           final String fileName) {

        final String folderId = getGoogleDriveObjectId(folderName, MimeType.DRIVE_FOLDER);

        final File file = new File();
        file.setName(fileName);
        file.setMimeType(MimeType.DRIVE_SHEETS.getType());
        file.setParents(Arrays.asList(folderId));

        final FileContent content = new FileContent(MimeType.EXCEL_DOWNLOAD.getType(), fileToUpload);

        try {
            drive.files().create(file, content).setFields("id").execute();
        } catch (IOException e) {
            throw new GoogleDriveRequestException(e);
        }
    }
}
