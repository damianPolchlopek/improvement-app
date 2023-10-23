package com.improvement_app;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ApplicationVariables {

    @Value("${path.to.excel}")
    public static final String PATH_TO_EXCEL_FILES = "src/main/resources/tmp_files/";

    public static final String EXCEL_EXTENSION = ".xlsx";


    public static final String DRIVE_PRODUCTS_SHEET_NAME = "Products";
    public static final String DRIVE_RECIPES_SHEET_NAME = "Recipes";

}
