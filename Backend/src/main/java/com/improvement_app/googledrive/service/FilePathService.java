package com.improvement_app.googledrive.service;

import org.springframework.stereotype.Service;

import java.io.File;

import static com.improvement_app.ApplicationVariables.*;

@Service
public class FilePathService {
    public static final String PATH_TO_EXCEL_FILES = "src/main/resources/tmp_files/";
    public static final String EXCEL_EXTENSION = ".xlsx";

    public static final String PRODUCTS_SHEET_NAME = "Products";
    public static final String RECIPES_SHEET_NAME = "Recipes";

    public static final String TRAININGS_FOLDER_NAME = "PlikiPliki";
    public static final String TRAININGS_CATEGORIES_FOLDER_NAME = "Categories";
    public static final String TRAINING_TEMPLATES_FOLDER_NAME = "Training Templates";


    public File getPathToDownloadedFile(String fileName) {
        return new File(PATH_TO_EXCEL_FILES + fileName + EXCEL_EXTENSION);
    }

    public File getProductFile() {
        return new File(PATH_TO_EXCEL_FILES + DRIVE_PRODUCTS_SHEET_NAME + EXCEL_EXTENSION);
    }

}
