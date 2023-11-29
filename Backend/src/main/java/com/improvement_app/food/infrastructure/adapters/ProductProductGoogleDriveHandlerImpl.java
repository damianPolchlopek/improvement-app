package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.ProductGoogleDriveHandler;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.infrastructure.googledrivefileparser.ProductParser;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.types.MimeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.food.FoodModuleVariables.PRODUCTS_SHEET_NAME;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ProductProductGoogleDriveHandlerImpl implements ProductGoogleDriveHandler {

    private final FilePathService filePathService;
    private final GoogleDriveFileService googleDriveFileService;
    private final ProductParser productParser;

    @Override
    public List<Product> findAll() throws IOException {
        downloadNewProductsFile();
        final File file = filePathService.getDownloadedFile(PRODUCTS_SHEET_NAME);
        final List<Product> products = productParser.parseExcelProductsFile(file);

        log.info("Dodaje do bazy danych produkty: {}", products);
        return products;
    }

    private void downloadNewProductsFile() {
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(PRODUCTS_SHEET_NAME, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(PRODUCTS_SHEET_NAME, fileId, MimeType.DRIVE_SHEETS.getType());

        final File file = filePathService.getDownloadedFile(PRODUCTS_SHEET_NAME);
        if (file.exists()) {
            file.delete();
        }

        googleDriveFileService.downloadFile(driveFileItemDTO);
    }
}
