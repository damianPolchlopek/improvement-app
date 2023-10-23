package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealGoogleDriveHandler;
import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.infrastructure.googledrivefileparser.MealParser;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.ApplicationVariables.EXCEL_EXTENSION;
import static com.improvement_app.ApplicationVariables.PATH_TO_EXCEL_FILES;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class MealGoogleDriveHandlerImpl implements MealGoogleDriveHandler {

    private final GoogleDriveFileService googleDriveFileService;
    private final MealParser mealParser;

    @Override
    public List<DriveFileItemDTO> findAll(String mealFolder) throws IOException {
        return googleDriveFileService.getDriveFiles(mealFolder);
    }

    @Override
    public Meal findByName(DriveFileItemDTO mealFileName) throws IOException {
        googleDriveFileService.downloadFile(mealFileName);

        File file = getMealFile(mealFileName.getName());

        return mealParser.parseMealFile(file);
    }

    private File getMealFile(String mealFileName) {
        final String fileName = PATH_TO_EXCEL_FILES + mealFileName + EXCEL_EXTENSION;
        return new File(fileName);
    }
}
