package com.improvement_app.food.infrastructure.googledrivefileparser;

import com.improvement_app.food.application.ports.out.InitializerPort;
import com.improvement_app.food.domain.exceptions.DataInitializationException;
import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.infrastructure.database.MealRepository;
import com.improvement_app.food.infrastructure.database.ProductRepository;
import com.improvement_app.food.infrastructure.googledrivefileparser.initializers.MealInitializer;
import com.improvement_app.food.infrastructure.googledrivefileparser.initializers.ProductInitializer;
import com.improvement_app.food.infrastructure.googledrivefileparser.initializers.SweetsInitializer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FoodDataInitializationService implements InitializerPort {

    private final ProductInitializer productInitializer;
    private final MealInitializer mealInitializer;
    private final SweetsInitializer sweetsInitializer;
    private final ProductRepository productRepository;
    private final MealRepository mealRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String INITIALIZATION_START_MESSAGE = "Starting food data initialization";
    private static final String INITIALIZATION_SUCCESS_MESSAGE = "Food data initialization completed successfully";
    private static final String INITIALIZATION_ERROR_MESSAGE = "Food data initialization failed";

    @Override
    @Transactional
    public void initializeData() {
        log.info(INITIALIZATION_START_MESSAGE);
        messagingTemplate.convertAndSend("/topic/messages", INITIALIZATION_START_MESSAGE);

        try {
            clearExistingData();

            List<ProductEntity> products = productInitializer.initializeProducts();
            mealInitializer.initializeMeals(products);
            sweetsInitializer.initializeSweets();

            log.info(INITIALIZATION_SUCCESS_MESSAGE);
            messagingTemplate.convertAndSend("/topic/messages", INITIALIZATION_SUCCESS_MESSAGE);

        } catch (Exception e) {
            log.error(INITIALIZATION_ERROR_MESSAGE, e);
            messagingTemplate.convertAndSend("/topic/messages", INITIALIZATION_ERROR_MESSAGE + ": " + e.getMessage());
            throw new DataInitializationException("Failed to initialize food data", e);
        }
    }

    private void clearExistingData() {
        log.info("Clearing existing data from database");
        mealRepository.deleteAll();
        productRepository.deleteAll();
    }
}