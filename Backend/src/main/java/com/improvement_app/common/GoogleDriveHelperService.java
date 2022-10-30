package com.improvement_app.common;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.improvement_app.common.types.MimeType;
import com.improvement_app.workouts.dto.DriveFileItemDTO;
import com.improvement_app.workouts.exceptions.TooMuchGoogleDriveFilesException;
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
public class GoogleDriveHelperService {

    private final Drive drive;

    public List<DriveFileItemDTO> getDriveFiles(final String folderName) throws IOException {
        final String folderId = getGoogleDriveObjectId(folderName, MimeType.DRIVE_FOLDER);
        final String query = "mimeType='" + MimeType.DRIVE_SHEETS.getType()
                + "' and '" + folderId + "' in parents ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        final List<File> allFiles = getAllFiles(request);

        return allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());
    }

    public String getGoogleDriveObjectId(final String googleDriveFileName,
                                          final MimeType type) throws IOException {
        final String query = "mimeType='" + type.getType()
                + "' and name contains '" + googleDriveFileName + "' ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new TooMuchGoogleDriveFilesException("Return more than one folder");

        final List<DriveFileItemDTO> responseList = allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());

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
//                LOGGER.error("An error occurred: " + e);
                request.setPageToken(null);
            }
        } while (request.getPageToken() != null &&
                request.getPageToken().length() > 0);

        return result;
    }

    public void deleteFile(final String fileId) throws IOException {
        drive.files().delete(fileId).execute();
    }

    public void downloadFile(final DriveFileItemDTO file) throws IOException {
        final String fileName = ApplicationVariables.pathToExcelsFiles + file.getName() +
                ApplicationVariables.EXCEL_EXTENSION;
        drive.files().export(file.getId(), MimeType.EXCEL.getType())
                .executeMediaAndDownloadTo(new FileOutputStream(fileName));
    }

    public void createFile(final File file, final FileContent content) throws IOException {
        drive.files().create(file, content).setFields("id").execute();
    }

    public void uploadFileInFolder(final String folderName,
                                   final java.io.File fileToUpload,
                                   final String fileName) throws IOException {

        final String folderId = getGoogleDriveObjectId(folderName, MimeType.DRIVE_FOLDER);

        final File file = new File();
        file.setName(fileName);
        file.setMimeType(MimeType.DRIVE_SHEETS.getType());
        file.setParents(Arrays.asList(folderId));

        final FileContent content = new FileContent(MimeType.EXCEL_DOWNLOAD.getType(), fileToUpload);
        createFile(file, content);
    }
}
