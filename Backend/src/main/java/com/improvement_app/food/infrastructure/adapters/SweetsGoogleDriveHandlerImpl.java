package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.SweetsGoogleDriveHandler;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.infrastructure.googledrivefileparser.SweetsParser;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.types.MimeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.food.FoodModuleVariables.SWEETS_SHEET_NAME;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SweetsGoogleDriveHandlerImpl implements SweetsGoogleDriveHandler {

    private final FilePathService filePathService;
    private final GoogleDriveFileService googleDriveFileService;
    private final SweetsParser sweetsParser;

    @Override
    public List<MealRecipe> findAll() throws IOException {
        downloadNewProductsFile();
        final File file = filePathService.getDownloadedFile(SWEETS_SHEET_NAME);
        final List<MealRecipe> sweets = sweetsParser.parseExcelProductsFile(file);

        log.info("Dodaje do bazy danych slodycze: {}", sweets);
        return sweets;
    }

    private void downloadNewProductsFile() {
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(SWEETS_SHEET_NAME, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(SWEETS_SHEET_NAME, fileId, MimeType.DRIVE_SHEETS.getType());

        final File file = filePathService.getDownloadedFile(SWEETS_SHEET_NAME);
        if (file.exists()) {
            file.delete();
        }

        googleDriveFileService.downloadFile(driveFileItemDTO);
    }
}
