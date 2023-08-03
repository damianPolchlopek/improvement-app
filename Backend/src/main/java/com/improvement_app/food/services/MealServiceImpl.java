package com.improvement_app.food.services;


import com.improvement_app.food.dto.DietSummaryDto;
import com.improvement_app.food.entity.DietSummary;
import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;
import com.improvement_app.food.helpers.DriveFilesHelper;
import com.improvement_app.food.FoodModuleVariable;
import com.improvement_app.food.repository.DietSummaryRepository;
import com.improvement_app.food.repository.MealRepository;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.improvement_app.ApplicationVariables.EXCEL_EXTENSION;
import static com.improvement_app.ApplicationVariables.PATH_TO_EXCEL_FILES;

@Service
@AllArgsConstructor
public class MealServiceImpl implements MealService {
    private static final Logger LOGGER = Logger.getLogger(MealServiceImpl.class);

    private final GoogleDriveFileService googleDriveFileService;

    private MealRepository mealRepository;

    @Override
    @Transactional
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
    @Transactional
    public List<Meal> getMeals(MealCategory mealCategory, MealType mealType, String mealName, String sortBy) {
        List<Meal> meals = mealRepository.findAllByName(mealName, sortBy);

        if (mealCategory != MealCategory.ALL){
            meals = meals
                    .stream()
                    .filter(meal -> meal.getCategory() == mealCategory)
                    .collect(Collectors.toList());
        }

        if (mealType != MealType.ALL){
            meals = meals
                    .stream()
                    .filter(meal -> meal.getType() == mealType)
                    .collect(Collectors.toList());
        }

        return meals;
    }

    @Override
    @Transactional
    public void deleteAllMeals() {
        mealRepository.deleteAll();
    }

}
