package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealGoogleDriveHandler;
import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.domain.MealRecipe;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService {

    private final MealGoogleDriveHandler mealGoogleDriveHandler;
    private final MealHandler mealHandler;
    private final SimpMessagingTemplate messagingTemplate;

    public List<MealRecipe> initMeals() throws IOException {
        final List<MealRecipe> mealRecipes = new ArrayList<>();
        List<DriveFileItemDTO> mealsToParse = mealGoogleDriveHandler.findAll(RECIPES_SHEET_NAME);
        int i = 0;
        for (DriveFileItemDTO mealName : mealsToParse) {
            final String logMessage = String.format("(%d/%d) Dodaje do bazy danych posiłek o nazwie: %s ",
                    ++i, mealsToParse.size(), mealName.getName());
            log.info(logMessage);

            MealRecipe parsedMealRecipe = mealGoogleDriveHandler.findByName(mealName);
            messagingTemplate.convertAndSend("/topic/messages", logMessage);

            mealRecipes.add(parsedMealRecipe);
        }

        log.info("Dodaje do bazy danych posiłki: " + mealRecipes);
        mealHandler.saveAll(mealRecipes);

        return mealRecipes;
    }



    public List<MealRecipe> getMeals(MealCategory mealCategory,
                                     MealType mealType,
                                     MealPopularity mealPopularity,
                                     String mealName,
                                     String sortBy,
                                     boolean onOnePortion) {

        List<MealRecipe> mealRecipes = mealHandler.findAllByName(mealName, sortBy);

        if (mealCategory != MealCategory.ALL) {
            mealRecipes = mealRecipes
                    .stream()
                    .filter(meal -> meal.getCategory() == mealCategory)
                    .collect(Collectors.toList());
        }

        if (mealType != MealType.ALL) {
            mealRecipes = mealRecipes
                    .stream()
                    .filter(meal -> meal.getType() == mealType)
                    .collect(Collectors.toList());
        }

        if (mealPopularity != MealPopularity.ALL) {
            mealRecipes = mealRecipes
                    .stream()
                    .filter(meal -> meal.getPopularity() == mealPopularity)
                    .collect(Collectors.toList());
        }

        if (onOnePortion) {
            mealRecipes = mealRecipes.stream()
                .map(meal -> {
                        meal.getIngredients()
                                .forEach(mealIngredient ->
                                        mealIngredient.setAmount(mealIngredient.getAmount() / meal.getPortionAmount()));

                        return meal;
                    })
                .collect(Collectors.toList());
        }

        return mealRecipes;
    }

    public void deleteAll() {
        mealHandler.deleteAll();
    }

}
