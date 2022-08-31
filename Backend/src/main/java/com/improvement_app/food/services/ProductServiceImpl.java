package com.improvement_app.food.services;

import com.improvement_app.common.ApplicationVariables;
import com.improvement_app.common.GoogleDriveHelperService;
import com.improvement_app.common.types.MimeType;
import com.improvement_app.food.controllers.ProductRepository;
import com.improvement_app.food.entity.Product;
import com.improvement_app.food.helpers.DriveFilesHelper;
import com.improvement_app.workouts.dto.DriveFileItemDTO;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private static final Resource TMP_FILES_PATH = ApplicationVariables.pathToExcelsFiles;
    private static final String EXCEL_EXTENSION = ApplicationVariables.EXCEL_EXTENSION;
    private static final Logger LOGGER = Logger.getLogger(ProductServiceImpl.class);

    private final GoogleDriveHelperService googleDriveHelperService;
    ProductRepository productRepository;

    public List<Product> initProducts() throws IOException {
        final String sheetName = ApplicationVariables.DRIVE_PRODUCTS_SHEET_NAME;
        final String fileId = googleDriveHelperService.getGoogleDriveObjectId(sheetName, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(sheetName, fileId, MimeType.DRIVE_SHEETS.getType());
        googleDriveHelperService.downloadFile(driveFileItemDTO);

        final String fileName = TMP_FILES_PATH + driveFileItemDTO.getName() + EXCEL_EXTENSION;
        final java.io.File file = new java.io.File(fileName);

        final List<Product> products = DriveFilesHelper.parseExcelProductsFile(file);
        productRepository.saveAll(products);

        return products;
    }

}
