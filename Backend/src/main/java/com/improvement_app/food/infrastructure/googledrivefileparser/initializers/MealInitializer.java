package com.improvement_app.food.infrastructure.googledrivefileparser.initializers;
import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.infrastructure.database.MealRepository;
import com.improvement_app.food.infrastructure.googledrivefileparser.FileDownloadService;
import com.improvement_app.food.infrastructure.googledrivefileparser.parsers.MealParser;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.improvement_app.food.FoodModuleVariables.RECIPES_SHEET_NAME;

@Slf4j
@Component
@RequiredArgsConstructor
public class MealInitializer {

    private final GoogleDriveFileService googleDriveFileService;
    private final FileDownloadService fileDownloadService;
    private final MealParser mealParser;
    private final MealRepository mealRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String MEAL_PROCESSING_MESSAGE = "(%d/%d) Processing meal: %s";
    private static final String MEALS_COMPLETED_MESSAGE = "Successfully processed {} meals";
    private static final String MEAL_PARSE_ERROR_MESSAGE = "Failed to parse meal: {} - {}";

    public void initializeMeals(List<ProductEntity> products) {
        messagingTemplate.convertAndSend("/topic/messages", "Starting meal parsing process...");

        Map<Long, ProductEntity> productMap = products.stream()
                .collect(Collectors.toMap(ProductEntity::getId, Function.identity()));

        List<DriveFileItemDTO> mealFiles = findAllMealFiles();
        List<MealRecipeEntity> processedMeals = processMealFiles(mealFiles, productMap);

        if (!processedMeals.isEmpty()) {
            mealRepository.saveAll(processedMeals);
            log.info(MEALS_COMPLETED_MESSAGE, processedMeals.size());
        }
    }

    private List<DriveFileItemDTO> findAllMealFiles() {
        List<DriveFileItemDTO> mealFiles = googleDriveFileService.listFiles(RECIPES_SHEET_NAME);

        if (mealFiles.isEmpty()) {
            log.warn("No meal files found in folder: {}", RECIPES_SHEET_NAME);
        }

        return mealFiles;
    }

    private List<MealRecipeEntity> processMealFiles(List<DriveFileItemDTO> mealFiles,
                                                    Map<Long, ProductEntity> productMap) {
        List<MealRecipeEntity> processedMeals = new ArrayList<>();
        int totalFiles = mealFiles.size();
        int processedCount = 0;

        for (DriveFileItemDTO mealFile : mealFiles) {
            processedCount++;

            try {
                String progressMessage = String.format(MEAL_PROCESSING_MESSAGE,
                        processedCount, totalFiles, mealFile.getName());

                log.info(progressMessage);
                messagingTemplate.convertAndSend("/topic/messages", progressMessage);

                MealRecipeEntity meal = parseSingleMeal(mealFile, productMap);
                if (meal != null) {
                    processedMeals.add(meal);
                }

            } catch (Exception e) {
                log.error(MEAL_PARSE_ERROR_MESSAGE, mealFile.getName(), e.getMessage(), e);
                // Continue processing other meals instead of failing completely
            }
        }

        return processedMeals;
    }

    private MealRecipeEntity parseSingleMeal(DriveFileItemDTO mealFile,
                                             Map<Long, ProductEntity> productMap) throws IOException {
        try {
            googleDriveFileService.downloadFile(mealFile);
            return mealParser.parseMealFile(
                    fileDownloadService.getDownloadedFile(mealFile.getName()),
                    productMap
            );
        } catch (IOException e) {
            log.error("Failed to download or parse meal file: {}", mealFile.getName(), e);
            throw e;
        }
    }
}
