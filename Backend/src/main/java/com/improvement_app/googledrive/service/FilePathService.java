package com.improvement_app.googledrive.service;

import org.springframework.stereotype.Service;

import java.io.File;


@Service
public class FilePathService {
    public static final String PATH_TO_EXCEL_FILES = "src/main/resources/tmp_files/";
    public static final String EXCEL_EXTENSION = ".xlsx";


    public File getDownloadedFile(String fileName) {
        return new File(PATH_TO_EXCEL_FILES + fileName + EXCEL_EXTENSION);
    }

    public String getExcelPath(String fileName) {
        return PATH_TO_EXCEL_FILES + fileName + EXCEL_EXTENSION;
    }

}
