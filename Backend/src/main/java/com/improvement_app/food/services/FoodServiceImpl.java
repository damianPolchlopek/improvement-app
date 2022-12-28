package com.improvement_app.food.services;


import com.improvement_app.ApplicationVariables;
import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.Product;
import com.improvement_app.food.helpers.DriveFilesHelper;
import com.improvement_app.food.helpers.FoodModuleVariable;
import com.improvement_app.food.repository.MealRepository;
import com.improvement_app.food.repository.ProductRepository;
import com.improvement_app.google_drive.entity.DriveFileItemDTO;
import com.improvement_app.google_drive.service.GoogleDriveFileService;
import com.improvement_app.google_drive.types.MimeType;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.improvement_app.ApplicationVariables.EXCEL_EXTENSION;
import static com.improvement_app.ApplicationVariables.PATH_TO_EXCEL_FILES;

@Service
@AllArgsConstructor
public class FoodServiceImpl implements FoodService {
    private static final Logger LOGGER = Logger.getLogger(FoodServiceImpl.class);

    //TODO: refaktor do czesci wspolnej serwisu z googleDrivea
    private final GoogleDriveFileService googleDriveFileService;
    private ProductRepository productRepository;
    private MealRepository mealRepository;

    public List<Product> initProducts() throws IOException {
        final String sheetName = FoodModuleVariable.DRIVE_PRODUCTS_SHEET_NAME;
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(sheetName, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(sheetName, fileId, MimeType.DRIVE_SHEETS.getType());
        googleDriveFileService.downloadFile(driveFileItemDTO);

        final String fileName = PATH_TO_EXCEL_FILES + driveFileItemDTO.getName() + EXCEL_EXTENSION;
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
        final String mealFolder = FoodModuleVariable.DRIVE_RECIPES_SHEET_NAME;

        final List<DriveFileItemDTO> responseList = googleDriveFileService.getDriveFiles(mealFolder);
        final List<Meal> meals = new ArrayList<>();

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveFileService.downloadFile(driveFileItemDTO);

            final String mealName = driveFileItemDTO.getName();
            final String fileName = PATH_TO_EXCEL_FILES + mealName + EXCEL_EXTENSION;

            java.io.File file = new java.io.File(fileName);
            Meal parsedMeal = DriveFilesHelper.parseMealFile(file);

            meals.add(parsedMeal);

        }

        LOGGER.info("Dodaje do bazy danych posiłki: " + meals);
        mealRepository.saveAll(meals);

        return meals;
    }

    @Override
    public void deleteAllMeals() {
        mealRepository.deleteAll();
    }

}
