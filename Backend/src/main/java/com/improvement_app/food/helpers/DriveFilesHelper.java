package com.improvement_app.food.helpers;

import com.improvement_app.food.entity.Product;
import com.improvement_app.food.entity.Unit;
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
    public static List<Product> parseExcelProductsFile(final File file) throws IOException {
        List<Product> productList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            XSSFSheet sheet = wb.getSheetAt(0);
            final int ID_INDEX = 0;
            final int NAME_INDEX = 1;
            final int KCAL_INDEX = 2;
            final int PROTEIN_INDEX = 3;
            final int CARBOHYDRATES_INDEX = 4;
            final int FAT_INDEX = 5;
            final int AMOUNT_INDEX = 6;
            final int UNIT_INDEX = 7;

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

                Product product = new Product(id, name, kcal, protein, carbohydrates, fat, amount, unit);
                productList.add(product);
            }
        }

        return productList;
    }

    private static boolean checkIfNextRowExists(Row row) {
        final int FIRST_CELL_INDEX = 0;
        Cell cell = row.getCell(FIRST_CELL_INDEX);
        if (cell == null)
            return false;

        if(cell.getCellType() == CellType.STRING){
            String firstCellValue = cell.getStringCellValue();
            if (firstCellValue.equals("id")){
                return false;
            }
            return !firstCellValue.isEmpty();
        }

        return true;
    }

    private static Unit parseUnit(final String unit) {
        if (unit.equals("g")) {
            return Unit.gram;
        } else if (unit.equals("ml")) {
            return Unit.ml;
        } else {
            throw new RuntimeException("Bad Unit !!!");
        }
    }
}
