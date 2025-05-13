package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealGoogleDriveHandler;
import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.improvement_app.food.FoodModuleVariables.RECIPES_SHEET_NAME;
import static com.improvement_app.food.FoodModuleVariables.SWEETS_SHEET_NAME;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService {

    private final MealGoogleDriveHandler mealGoogleDriveHandler;
    private final MealHandler mealHandler;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Meal> initMeals() throws IOException {
        final List<Meal> meals = new ArrayList<>();
        List<DriveFileItemDTO> mealsToParse = mealGoogleDriveHandler.findAll(RECIPES_SHEET_NAME);
        int i = 0;
        for (DriveFileItemDTO mealName : mealsToParse) {
            Meal parsedMeal = mealGoogleDriveHandler.findByName(mealName);

            String logMessage = String.format("(%d/%d) Dodaje do bazy danych posiłek o nazwie: %s ",
                    i++, mealsToParse.size(), parsedMeal.getName());
            log.info(logMessage);
            messagingTemplate.convertAndSend("/topic/messages", logMessage);

            meals.add(parsedMeal);
        }

        log.info("Dodaje do bazy danych posiłki: " + meals);
        mealHandler.saveAll(meals);

        return meals;
    }



    public List<Meal> getMeals(MealCategory mealCategory,
                               MealType mealType,
                               MealPopularity mealPopularity,
                               String mealName,
                               String sortBy) {

        List<Meal> meals = mealHandler.findAllByName(mealName, sortBy);

        if (mealCategory != MealCategory.ALL) {
            meals = meals
                    .stream()
                    .filter(meal -> meal.getCategory() == mealCategory)
                    .collect(Collectors.toList());
        }

        if (mealType != MealType.ALL) {
            meals = meals
                    .stream()
                    .filter(meal -> meal.getType() == mealType)
                    .collect(Collectors.toList());
        }

        if (mealPopularity != MealPopularity.ALL) {
            meals = meals
                    .stream()
                    .filter(meal -> meal.getPopularity() == mealPopularity)
                    .collect(Collectors.toList());
        }

        return meals;
    }

    public void deleteAll() {
        mealHandler.deleteAll();
    }

    public List<Meal> findAllById(List<Long> ids) {
        return mealHandler.findAllById(ids);
    }

}
