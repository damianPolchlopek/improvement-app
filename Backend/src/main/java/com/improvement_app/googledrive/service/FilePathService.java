package com.improvement_app.googledrive.service;

import org.springframework.stereotype.Service;

import java.io.File;


@Service
public class FilePathService {

    private final String EXCEL_EXTENSION = ".xlsx";
    private final String fileDir;

    public FilePathService() {
        fileDir = System.getProperty("java.io.tmpdir");
    }

    public File getDownloadedFile(String fileName) {
        return new File(fileDir + fileName + EXCEL_EXTENSION);
    }

    public String getExcelPath(String fileName) {
        return fileDir + fileName + EXCEL_EXTENSION;
    }

}
