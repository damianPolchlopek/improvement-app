package com.improvement_app.food.infrastructure.googledrivefileparser.parsers;

import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.domain.enums.ProductCategory;
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

@Configuration
public class ProductParser extends GoogleDriveFilesHelper {
    public List<ProductEntity> parseExcelProductsFile(final File file) throws IOException {
        List<ProductEntity> productEntityList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            final int sheetNumber = wb.getNumberOfSheets();
            for (int i = 0; i < sheetNumber; i++) {
                XSSFSheet sheet = wb.getSheetAt(i);
                List<ProductEntity> productEntities = parseProductSheet(sheet);
                productEntityList.addAll(productEntities);
            }
        }

        return productEntityList;
    }

    private List<ProductEntity> parseProductSheet(XSSFSheet sheet) {
        final int ID_INDEX = 0;
        final int NAME_INDEX = 1;
        final int KCAL_INDEX = 2;
        final int PROTEIN_INDEX = 3;
        final int CARBOHYDRATES_INDEX = 4;
        final int FAT_INDEX = 5;
        final int AMOUNT_INDEX = 6;
        final int UNIT_INDEX = 7;

        List<ProductEntity> productEntityList = new ArrayList<>();
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
            final ProductCategory productCategory = ProductCategory.fromValue(sheet.getSheetName());

            ProductEntity productEntity = new ProductEntity(id, name, kcal, protein, carbohydrates, fat, amount, unit, productCategory);
            productEntityList.add(productEntity);
        }

        return productEntityList;
    }
}
