package com.improvement_app.food.helpers;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.Product;
import com.improvement_app.food.entity.MealIngredient;
import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;
import com.improvement_app.food.entity.enums.ProductCategory;
import com.improvement_app.food.entity.enums.Unit;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DriveFilesHelper {

    public static List<String> getProductCategories(final File file) throws IOException {
        List<String> categories = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            final int sheetNumber = wb.getNumberOfSheets();
            for (int i = 0; i < sheetNumber; i++) {
                XSSFSheet sheet = wb.getSheetAt(i);
                String sheetName = sheet.getSheetName();
                categories.add(sheetName);
            }
        }

        return categories;
    }

    public static List<Product> parseExcelProductsFile(final File file) throws IOException {
        List<Product> productList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            final int sheetNumber = wb.getNumberOfSheets();
            for (int i = 0; i < sheetNumber; i++) {
                XSSFSheet sheet = wb.getSheetAt(i);
                List<Product> products = parseProductSheet(sheet);
                productList.addAll(products);
            }
        }

        return productList;
    }

    private static List<Product> parseProductSheet(XSSFSheet sheet){
        final int ID_INDEX = 0;
        final int NAME_INDEX = 1;
        final int KCAL_INDEX = 2;
        final int PROTEIN_INDEX = 3;
        final int CARBOHYDRATES_INDEX = 4;
        final int FAT_INDEX = 5;
        final int AMOUNT_INDEX = 6;
        final int UNIT_INDEX = 7;

        List<Product> productList = new ArrayList<>();
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
            cell = row.getCell(AMOUNT_INDEX);
            final double amount = cell.getNumericCellValue();
            cell = row.getCell(UNIT_INDEX);
            final Unit unit = parseUnit(cell.getStringCellValue());
            final ProductCategory productCategory = parseProductCategory(sheet.getSheetName());

            Product product = new Product(id, name, kcal, protein, carbohydrates, fat, amount, unit, productCategory);
            productList.add(product);
        }

        return productList;
    }

    private static boolean checkIfNextRowExists(Row row) {
        final int FIRST_CELL_INDEX = 0;
        Cell cell = row.getCell(FIRST_CELL_INDEX);
        if (cell == null)
            return false;

        if (cell.getCellType() == CellType.STRING) {
            String firstCellValue = cell.getStringCellValue();
            if (firstCellValue.equals("id")) {
                return false;
            }
            return !firstCellValue.isEmpty();
        }

        return true;
    }

    private static Unit parseUnit(final String unit) {
        switch (unit) {
            case "g":
                return Unit.gram;
            case "ml":
                return Unit.ml;
            case "sztuk":
                return Unit.sztuk;
            case "łyżka":
                return Unit.łyżka;
            case "łyżeczka":
                return Unit.łyżeczka;
            case "szczypta":
                return Unit.szczypta;
            default:
                throw new RuntimeException("Bad Unit !!!");
        }
    }

    private static ProductCategory parseProductCategory(final String productCategoryName){
        final String MEAT_SHEET_NAME = "Mieso";
        final String DAIRY_SHEET_NAME = "Nabial";
        final String CARBO_SHEET_NAME = "Wegle";
        final String FAT_SHEET_NAME = "Tluszcze";
        final String FRUIT_VEGETABLES_SHEET_NAME = "OwoceWarzywa";
        final String SPICES_SHEET_NAME = "Przyprawy";
        final String SWEET_SHEET_NAME = "Slodycze";
        final String OTHER_SHEET_NAME = "Inne";

        switch (productCategoryName) {
            case MEAT_SHEET_NAME:
                return ProductCategory.Mieso;
            case DAIRY_SHEET_NAME:
                return ProductCategory.Nabial;
            case CARBO_SHEET_NAME:
                return ProductCategory.Wegle;
            case FAT_SHEET_NAME:
                return ProductCategory.Tluszcze;
            case FRUIT_VEGETABLES_SHEET_NAME:
                return ProductCategory.OwoceWarzywa;
            case SPICES_SHEET_NAME:
                return ProductCategory.Przyprawy;
            case SWEET_SHEET_NAME:
                return ProductCategory.Slodycze;
            case OTHER_SHEET_NAME:
                return ProductCategory.Inne;
            default:
                throw new RuntimeException("Bad Product Category !!!");
        }
    }

    public static Meal parseMealFile(final File file) throws IOException {
        final int MACRO_SHEET_INDEX = 0;
        final int INGREDIENT_SHEET_INDEX = 1;
        final int RECIPE_SHEET_INDEX = 2;

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            XSSFSheet macroSheet = wb.getSheetAt(MACRO_SHEET_INDEX);
            Meal meal = parseMacroSheet(macroSheet);

            XSSFSheet ingredientSheet = wb.getSheetAt(INGREDIENT_SHEET_INDEX);
            List<MealIngredient> mealIngredients = parseIngredientSheet(ingredientSheet);
            meal.setMealIngredients(mealIngredients);

            XSSFSheet recipeSheet = wb.getSheetAt(RECIPE_SHEET_INDEX);
            List<String> recipe = parseRecipeSheet(recipeSheet);
            meal.setRecipe(recipe);

            return meal;
        }
    }

    private static Meal parseMacroSheet(XSSFSheet sheet) {
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

        final String name = sheet.getRow(NAME_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final double kcal = sheet.getRow(KCAL_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double protein = sheet.getRow(PROTEIN_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double carbohydrates = sheet.getRow(CARBOHYDRATES_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double fat = sheet.getRow(FAT_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final double portionAmount = sheet.getRow(PORTION_AMOUNT_INDEX).getCell(DATA_ROW_INDEX).getNumericCellValue();
        final String url = sheet.getRow(URL_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final String type = sheet.getRow(TYPE_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();
        final String category = sheet.getRow(CATEGORY_INDEX).getCell(DATA_ROW_INDEX).getStringCellValue();

        return new Meal(name, kcal, protein, carbohydrates, fat, portionAmount, url,
                parseType(type), parseCategory(category));
    }

    private static MealType parseType(final String type) {
        switch (type) {
            case "Kurczak":
                return MealType.CHICKEN;
            case "Wieprzowina":
                return MealType.PORK;
            case "Owsianka":
                return MealType.OATMEAL;
            default:
                throw new RuntimeException("Bad Meal Type !!!");
        }
    }

    private static MealCategory parseCategory(final String category) {
        switch (category) {
            case "Śniadanie":
                return MealCategory.BREAKFAST;
            case "Obiad":
                return MealCategory.LUNCH;
            case "Kolacja":
                return MealCategory.DINNER;
            case "DrugiObiad":
                return MealCategory.HOT_DISH;
            default:
                throw new RuntimeException("Bad Meal Category !!!");
        }
    }

    private static List<MealIngredient> parseIngredientSheet(XSSFSheet sheet) {
        final int ID_INDEX = 0;
        final int NAME_INDEX = 1;
        final int AMOUNT_INDEX = 2;
        final int UNIT_INDEX = 3;

        List<MealIngredient> products = new ArrayList<>();
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

            MealIngredient mealIngredient = new MealIngredient(productId, name, amount, unit);
            products.add(mealIngredient);
        }

        return products;
    }

    private static List<String> parseRecipeSheet(XSSFSheet sheet) {
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
