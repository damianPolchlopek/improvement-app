package com.improvement_app.food.infrastructure.googledrivefileparser.parsers;

import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.food.domain.enums.Unit;
import com.improvement_app.food.infrastructure.googledrivefileparser.GoogleDriveFilesHelper;
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
import java.util.Map;

@Configuration
public class MealParser extends GoogleDriveFilesHelper {
    public MealRecipeEntity parseMealFile(final File file, Map<Long, ProductEntity> products) throws IOException {
        final int MACRO_SHEET_INDEX = 0;
        final int INGREDIENT_SHEET_INDEX = 1;
        final int RECIPE_SHEET_INDEX = 2;

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            XSSFSheet macroSheet = wb.getSheetAt(MACRO_SHEET_INDEX);
            MealRecipeEntity mealRecipeEntity = parseMacroSheet(macroSheet);

            XSSFSheet ingredientSheet = wb.getSheetAt(INGREDIENT_SHEET_INDEX);
            List<MealIngredientEntity> mealIngredientEntities = parseIngredientSheet(ingredientSheet, mealRecipeEntity, products);
            mealRecipeEntity.setIngredients(mealIngredientEntities);

            XSSFSheet recipeSheet = wb.getSheetAt(RECIPE_SHEET_INDEX);
            List<String> recipe = parseRecipeSheet(recipeSheet);
            mealRecipeEntity.setRecipe(recipe);

            return mealRecipeEntity;
        }
    }

    private MealRecipeEntity parseMacroSheet(XSSFSheet sheet) {
        final int DATA_ROW_INDEX = 1;

        final int NAME_INDEX = 0;
        final int KCAL_INDEX = 1;
        final int PROTEIN_INDEX = 2;
        final int CARBOHYDRATES_INDEX = 3;
        final int FAT_INDEX = 4;
        final int PORTION_AMOUNT_INDEX = 5;
        final int URL_INDEX = 6;
        final int TYPE_INDEX = 7;
        final int CATEGORY_INDEX = 8;
        final int ID_INDEX = 9;
        final int POPULARITY_INDEX = 10;

        final String name = sheet.getRow(NAME_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final double kcal = sheet.getRow(KCAL_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double protein = sheet.getRow(PROTEIN_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double carbohydrates = sheet.getRow(CARBOHYDRATES_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double fat = sheet.getRow(FAT_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double portionAmount = sheet.getRow(PORTION_AMOUNT_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final String url = sheet.getRow(URL_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final String type = sheet.getRow(TYPE_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final String category = sheet.getRow(CATEGORY_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final Long id = (long) sheet.getRow(ID_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final String popularity = sheet.getRow(POPULARITY_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();

        return new MealRecipeEntity(id, name, kcal, protein, carbohydrates, fat, portionAmount, url,
                MealType.fromValue(type), MealCategory.fromValue(category), MealPopularity.fromValue(popularity));
    }

    private List<MealIngredientEntity> parseIngredientSheet(XSSFSheet sheet, MealRecipeEntity mealRecipeEntity, Map<Long, ProductEntity> products) {
        final int ID_INDEX = 0;
        final int NAME_INDEX = 1;
        final int AMOUNT_INDEX = 2;
        final int UNIT_INDEX = 3;

        List<MealIngredientEntity> mealIngredientEntities = new ArrayList<>();
        for (final Row row : sheet) {
            if (!checkIfNextRowExists(row))
                continue;

            Cell cell = row.getCell(ID_INDEX);
            final int productId = (int) cell.getNumericCellValue();
            cell = row.getCell(NAME_INDEX);
            final String name = cell.getStringCellValue();
            cell = row.getCell(AMOUNT_INDEX);
            final double amount = cell.getNumericCellValue();
            cell = row.getCell(UNIT_INDEX);
            final Unit unit = parseUnit(cell.getStringCellValue());

            final ProductEntity productEntity = products.get((long) productId);
            MealIngredientEntity mealIngredientEntity = new MealIngredientEntity(productEntity, name, amount, unit, mealRecipeEntity);
            mealIngredientEntities.add(mealIngredientEntity);
        }

        return mealIngredientEntities;
    }

    private List<String> parseRecipeSheet(XSSFSheet sheet) {
        final int RECIPE_POINT_INDEX = 0;
        List<String> result = new ArrayList<>();
        for (final Row row : sheet) {
            if (!checkIfNextRowExists(row))
                continue;

            Cell cell = row.getCell(RECIPE_POINT_INDEX);
            result.add(cell.getStringCellValue());
        }

        return result;
    }
}
