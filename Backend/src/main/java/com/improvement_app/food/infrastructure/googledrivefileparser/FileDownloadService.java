package com.improvement_app.food.infrastructure.googledrivefileparser;

import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.types.MimeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileDownloadService {

    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;

    private static final String FILE_DOWNLOAD_MESSAGE = "Downloading file: {}";
    private static final String FILE_ALREADY_EXISTS_MESSAGE = "File already exists, removing old version: {}";


    public File downloadAndGetFile(String googleDriveFileName) throws IOException {
        log.info(FILE_DOWNLOAD_MESSAGE, googleDriveFileName);

        try {
            String fileId = googleDriveFileService.getGoogleDriveObjectId(
                    googleDriveFileName,
                    MimeType.DRIVE_SHEETS
            );

            DriveFileItemDTO driveFileItem = new DriveFileItemDTO(
                    googleDriveFileName,
                    fileId,
                    MimeType.DRIVE_SHEETS.getType()
            );

            removeExistingFile(googleDriveFileName);
            googleDriveFileService.downloadFile(driveFileItem);

            return filePathService.getDownloadedFile(googleDriveFileName);

        } catch (Exception e) {
            log.error("Failed to download file: {}", googleDriveFileName, e);
            throw new IOException("File download failed: " + googleDriveFileName, e);
        }
    }

    public File getDownloadedFile(String fileName) {
        return filePathService.getDownloadedFile(fileName);
    }

    private void removeExistingFile(String fileName) {
        File existingFile = filePathService.getDownloadedFile(fileName);

        if (existingFile.exists()) {
            log.info(FILE_ALREADY_EXISTS_MESSAGE, fileName);

            if (!existingFile.delete()) {
                log.warn("Failed to delete existing file: {}", fileName);
            }
        }
    }
}
