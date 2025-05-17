package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.MealRecipe;

import java.io.IOException;
import java.util.List;

public interface SweetsGoogleDriveHandler {
    List<MealRecipe> findAll() throws IOException;

}
