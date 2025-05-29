package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.application.ports.SweetsGoogleDriveHandler;
import com.improvement_app.food.domain.MealRecipe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SweetsService {

    private final MealHandler mealHandler;
    private final SweetsGoogleDriveHandler sweetsGoogleDriveHandler;

    public void initSweets() throws IOException {
        List<MealRecipe> sweets = sweetsGoogleDriveHandler.findAll();
        mealHandler.saveAll(sweets);
    }

}
