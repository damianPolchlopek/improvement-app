package com.improvement_app.googledrive.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;


@Service
public class FilePathService {

    private final String EXCEL_EXTENSION = ".xlsx";

    @Value("${path.file.excel}")
    private String fileDir;

    public File getDownloadedFile(String fileName) {
        return new File(fileDir + fileName + EXCEL_EXTENSION);
    }

    public String getExcelPath(String fileName) {
        return fileDir + fileName + EXCEL_EXTENSION;
    }

}
