package com.improvement_app.food.services;

import com.improvement_app.common.ApplicationVariables;
import com.improvement_app.common.GoogleDriveHelperService;
import com.improvement_app.common.types.MimeType;
import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.Product;
import com.improvement_app.food.helpers.DriveFilesHelper;
import com.improvement_app.food.repository.ProductRepository;
import com.improvement_app.workouts.dto.DriveFileItemDTO;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class FoodServiceImpl implements FoodService {

    private static final Resource TMP_FILES_PATH = ApplicationVariables.pathToExcelsFiles;
    private static final String EXCEL_EXTENSION = ApplicationVariables.EXCEL_EXTENSION;
    private static final Logger LOGGER = Logger.getLogger(FoodServiceImpl.class);

    //TODO: refaktor do czesci wspolnej serwisu z googleDrivea
    private final GoogleDriveHelperService googleDriveHelperService;
    ProductRepository productRepository;

    public List<Product> initProducts() throws IOException {
        final String sheetName = ApplicationVariables.DRIVE_PRODUCTS_SHEET_NAME;
        final String fileId = googleDriveHelperService.getGoogleDriveObjectId(sheetName, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(sheetName, fileId, MimeType.DRIVE_SHEETS.getType());
        googleDriveHelperService.downloadFile(driveFileItemDTO);

        final String fileName = TMP_FILES_PATH + driveFileItemDTO.getName() + EXCEL_EXTENSION;
        final java.io.File file = new java.io.File(fileName);

        final List<Product> products = DriveFilesHelper.parseExcelProductsFile(file);
        LOGGER.info("Dodaje do bazy danych produkty: " + products);
        productRepository.saveAll(products);

        return products;
    }

    @Override
    public void deleteAllProducts() {
        productRepository.deleteAll();
    }




    @Override
    public List<Meal> initMeals() throws IOException {
        final String mealFolder = ApplicationVariables.DRIVE_RECIPES_SHEET_NAME;

        final List<DriveFileItemDTO> responseList = googleDriveHelperService.getDriveFiles(mealFolder);
        final List<Meal> meals = new ArrayList<>();

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveHelperService.downloadFile(driveFileItemDTO);

            final String mealName = driveFileItemDTO.getName();
            final String fileName = TMP_FILES_PATH + mealName + EXCEL_EXTENSION;

            java.io.File file = new java.io.File(fileName);
            Meal parsedMeal = DriveFilesHelper.parseMealFile(file);
            meals.add(parsedMeal);
        }

        return meals;
    }

}
