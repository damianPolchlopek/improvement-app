package com.improvement_app.food.infrastructure.googledrivefileparser;

import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.enums.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class SweetsParser extends GoogleDriveFilesHandler {
    public List<MealRecipe> parseExcelProductsFile(final File file) throws IOException {
        List<MealRecipe> sweetsList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            final int sheetNumber = wb.getNumberOfSheets();
            for (int i = 0; i < sheetNumber; i++) {
                XSSFSheet sheet = wb.getSheetAt(i);
                List<MealRecipe> products = parseProductSheet(sheet);
                sweetsList.addAll(products);
            }
        }

        return sweetsList;
    }

    private List<MealRecipe> parseProductSheet(XSSFSheet sheet) {
        final int ID_INDEX = 0;
        final int NAME_INDEX = 1;
        final int KCAL_INDEX = 2;
        final int PROTEIN_INDEX = 3;
        final int CARBOHYDRATES_INDEX = 4;
        final int FAT_INDEX = 5;
        final int CATEGORY_INDEX = 6;
        final int TYPE_INDEX = 7;
        final int POPULARITY_INDEX = 8;

        List<MealRecipe> productList = new ArrayList<>();
        for (final Row row : sheet) {
            if (!checkIfNextRowExists(row))
                continue;

            Cell cell = row.getCell(ID_INDEX);
            final Long id = (long) cell.getNumericCellValue();
            cell = row.getCell(NAME_INDEX);
            final String name = cell.getStringCellValue();
            cell = row.getCell(KCAL_INDEX);
            final double kcal = cell.getNumericCellValue();
            cell = row.getCell(PROTEIN_INDEX);
            final double protein = cell.getNumericCellValue();
            cell = row.getCell(CARBOHYDRATES_INDEX);
            final double carbohydrates = cell.getNumericCellValue();
            cell = row.getCell(FAT_INDEX);
            final double fat = cell.getNumericCellValue();
            cell = row.getCell(CATEGORY_INDEX);
            final MealCategory mealCategory = MealCategory.fromValue(cell.getStringCellValue());
            cell = row.getCell(TYPE_INDEX);
            final MealType mealType = MealType.fromValue(cell.getStringCellValue());
            cell = row.getCell(POPULARITY_INDEX);
            final MealPopularity mealPopularity = MealPopularity.fromValue(cell.getStringCellValue());

            MealRecipe sweets = new MealRecipe(id, name, kcal, protein, carbohydrates, fat, 1, "-",
                    mealType, mealCategory, mealPopularity);
            productList.add(sweets);
        }

        return productList;
    }
}
