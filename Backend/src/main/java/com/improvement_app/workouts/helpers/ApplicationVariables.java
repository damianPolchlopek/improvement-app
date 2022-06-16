package com.improvement_app.workouts.helpers;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ApplicationVariables {

    @Value("${path.to.excel}")
    public static final Resource pathToExcelsFiles = null;

    public static final String DRIVE_TRAININGS_FOLDER_NAME = "PlikiPliki";
    public static final String DRIVE_CATEGORIES_FOLDER_NAME = "Categories";
    public static final String EXCEL_EXTENSION = ".xlsx";

}
