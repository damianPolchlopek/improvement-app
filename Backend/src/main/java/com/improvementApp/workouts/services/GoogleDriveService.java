package com.improvementApp.workouts.services;

import com.improvementApp.workouts.DTO.DriveFileItemDTO;

import java.io.IOException;
import java.util.List;

public interface GoogleDriveService {
    public List<DriveFileItemDTO> listFiles(final String folderName) throws Exception;

    public void downloadFile(final String fileId) throws IOException;

    public String getFolderId(final String folderName) throws Exception;
}
