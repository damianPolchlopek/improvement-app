package com.improvement_app.food.infrastructure.googledrivefileparser;

import com.improvement_app.food.application.ports.InitializerHandler;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.infrastructure.database.MealRepository;
import com.improvement_app.food.infrastructure.database.ProductRepository;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.types.MimeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.improvement_app.food.FoodModuleVariables.*;

@Slf4j
@Repository
@RequiredArgsConstructor
public class GoogleDriveRepository implements InitializerHandler {

    private final FilePathService filePathService;
    private final GoogleDriveFileService googleDriveFileService;
    private final ProductParser productParser;
    private final MealParser mealParser;
    private final SweetsParser sweetsParser;

    private final ProductRepository productRepository;
    private final MealRepository mealRepository;

    private final SimpMessagingTemplate messagingTemplate;


    @Override
    public void initializeData() throws IOException {

        productRepository.deleteAll();
        List<Product> savedProducts = productRepository.saveAll(initProducts());
        Map<Long, Product> products = savedProducts
                .stream()
                .collect(Collectors.toMap(Product::getId, product -> product));


        // Initialize meals
        mealRepository.deleteAll();
        initMeals(products);


        // Initialize sweets
        initSweets();
    }

    private List<Product> initProducts() throws IOException {
        List<Product> products = findAllProducts();
        System.out.println("Dodaje do bazy danych produkty: " + products);

        return productRepository.saveAll(products);
    }

    private List<Product> findAllProducts() throws IOException {
        downloadNewProductsFile(PRODUCTS_SHEET_NAME);
        final File file = filePathService.getDownloadedFile(PRODUCTS_SHEET_NAME);
        final List<Product> products = productParser.parseExcelProductsFile(file);

        log.info("Dodaje do bazy danych produkty: {}", products);
        return products;
    }


    private List<MealRecipe> initMeals(Map<Long, Product> products) throws IOException {
        final List<MealRecipe> mealRecipes = new ArrayList<>();
        List<DriveFileItemDTO> mealsToParse = findAllMeals(RECIPES_SHEET_NAME);

        int i = 0;
        for (DriveFileItemDTO mealName : mealsToParse) {
            final String logMessage = String.format("(%d/%d) Dodaje do bazy danych posiłek o nazwie: %s ",
                    ++i, mealsToParse.size(), mealName.getName());
            log.info(logMessage);

            MealRecipe parsedMealRecipe = findMealByName(mealName, products);
            messagingTemplate.convertAndSend("/topic/messages", logMessage);

            mealRecipes.add(parsedMealRecipe);
        }

        log.info("Dodaje do bazy danych posiłki: " + mealRecipes);
        mealRepository.saveAll(mealRecipes);

        return mealRecipes;
    }

    public List<DriveFileItemDTO> findAllMeals(String mealFolder) {
        return googleDriveFileService.listFiles(mealFolder);
    }

    public MealRecipe findMealByName(DriveFileItemDTO mealFileName, Map<Long, Product> products) throws IOException {
        googleDriveFileService.downloadFile(mealFileName);

        File file = filePathService.getDownloadedFile(mealFileName.getName());

        return mealParser.parseMealFile(file, products);
    }


    public void initSweets() throws IOException {
        List<MealRecipe> sweets = findAllSweets();
        mealRepository.saveAll(sweets);
    }

    public List<MealRecipe> findAllSweets() throws IOException {
        downloadNewProductsFile(SWEETS_SHEET_NAME);
        final File file = filePathService.getDownloadedFile(SWEETS_SHEET_NAME);
        final List<MealRecipe> sweets = sweetsParser.parseExcelProductsFile(file);

        log.info("Dodaje do bazy danych slodycze: {}", sweets);
        return sweets;
    }


    private void downloadNewProductsFile(final String googleDriveFileName) throws IOException {
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(googleDriveFileName, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(googleDriveFileName, fileId, MimeType.DRIVE_SHEETS.getType());

        final File file = filePathService.getDownloadedFile(googleDriveFileName);
        if (file.exists()) {
            file.delete();
        }

        googleDriveFileService.downloadFile(driveFileItemDTO);
    }

}
