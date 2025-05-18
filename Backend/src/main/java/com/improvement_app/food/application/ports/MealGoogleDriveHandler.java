package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;

import java.io.IOException;
import java.util.List;

public interface MealGoogleDriveHandler {
    List<DriveFileItemDTO> findAll(String mealFolder) throws IOException;

    MealRecipe findByName(DriveFileItemDTO mealName) throws IOException;
}
