package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.ProductGoogleDriveHandler;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.infrastructure.googledrivefileparser.ProductParser;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.types.MimeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.ApplicationVariables.*;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ProductProductGoogleDriveHandlerImpl implements ProductGoogleDriveHandler {

    private final GoogleDriveFileService googleDriveFileService;
    private final ProductParser productParser;

    @Override
    public List<Product> findAll() throws IOException {
        downloadNewProductsFile();
        final File file = getProductFile();
        final List<Product> products = productParser.parseExcelProductsFile(file);

        log.info("Dodaje do bazy danych produkty: " + products);
        return products;
    }

    private File getProductFile() {
        final String filePath = PATH_TO_EXCEL_FILES + DRIVE_PRODUCTS_SHEET_NAME + EXCEL_EXTENSION;
        return new File(filePath);
    }

    private void downloadNewProductsFile() throws IOException {
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(DRIVE_PRODUCTS_SHEET_NAME, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(DRIVE_PRODUCTS_SHEET_NAME, fileId, MimeType.DRIVE_SHEETS.getType());

        final File file = getProductFile();
        if (file.exists()) {
            file.delete();
        }

        googleDriveFileService.downloadFile(driveFileItemDTO);
    }
}
