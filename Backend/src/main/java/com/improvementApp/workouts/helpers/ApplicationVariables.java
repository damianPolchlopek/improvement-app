package com.improvementApp.workouts.helpers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;


public class ApplicationVariables {

    @Value("${path.to.excel}")
    public static Resource TMP_FILES_PATH;

    public static String DRIVE_TRAININGS_FOLDER_NAME = "PlikiPliki";
    public static String DRIVE_CATEGORIES_FOLDER_NAME = "Categories";
    public static String EXCEL_EXTENSION = ".xlsx";
}
