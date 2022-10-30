package com.improvement_app.common;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ApplicationVariables {

    //TODO ogarnac to !!!
    @Value("${path.to.excel}")
    public static final Resource pathToExcelsFiles = null;

    public static final String DRIVE_TRAININGS_FOLDER_NAME = "PlikiPliki";
    public static final String DRIVE_CATEGORIES_FOLDER_NAME = "Categories";
    public static final String EXCEL_EXTENSION = ".xlsx";

    public static final String DRIVE_PRODUCTS_SHEET_NAME = "Products";
    public static final String DRIVE_RECIPES_SHEET_NAME = "Recipes";
}
