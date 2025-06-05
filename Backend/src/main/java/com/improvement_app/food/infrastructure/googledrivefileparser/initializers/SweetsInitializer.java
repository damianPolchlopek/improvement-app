package com.improvement_app.food.infrastructure.googledrivefileparser.initializers;

import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
import com.improvement_app.food.infrastructure.database.MealRepository;
import com.improvement_app.food.infrastructure.googledrivefileparser.FileDownloadService;
import com.improvement_app.food.infrastructure.googledrivefileparser.parsers.SweetsParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.food.FoodModuleVariables.SWEETS_SHEET_NAME;

@Slf4j
@Component
@RequiredArgsConstructor
public class SweetsInitializer {

    private final FileDownloadService fileDownloadService;
    private final SweetsParser sweetsParser;
    private final MealRepository mealRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String SWEETS_PROCESSING_MESSAGE = "Processing sweets from file: {}";
    private static final String SWEETS_SAVED_MESSAGE = "Successfully saved {} sweets to database";

    public void initializeSweets() throws IOException {
        log.info(SWEETS_PROCESSING_MESSAGE, SWEETS_SHEET_NAME);
        messagingTemplate.convertAndSend("/topic/messages", "Loading sweets...");

        try {
            File sweetsFile = fileDownloadService.downloadAndGetFile(SWEETS_SHEET_NAME);
            List<MealRecipeEntity> sweets = sweetsParser.parseExcelProductsFile(sweetsFile);

            validateSweets(sweets);
            mealRepository.saveAll(sweets);

            log.info(SWEETS_SAVED_MESSAGE, sweets.size());
            messagingTemplate.convertAndSend("/topic/messages",
                    String.format("Loaded %d sweets", sweets.size()));

        } catch (IOException e) {
            log.error("Failed to initialize sweets from file: {}", SWEETS_SHEET_NAME, e);
            throw new IOException("Sweets initialization failed", e);
        }
    }

    private void validateSweets(List<MealRecipeEntity> sweets) {
        if (sweets == null || sweets.isEmpty()) {
            log.warn("No sweets found in file: {}", SWEETS_SHEET_NAME);
            return;
        }

        long invalidSweets = sweets.stream()
                .filter(sweet -> sweet.getName() == null || sweet.getName().trim().isEmpty())
                .count();

        if (invalidSweets > 0) {
            log.warn("Found {} sweets with invalid names", invalidSweets);
        }
    }
}