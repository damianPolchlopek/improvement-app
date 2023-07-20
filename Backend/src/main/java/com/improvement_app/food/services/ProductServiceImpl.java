package com.improvement_app.food.services;

import com.improvement_app.food.entity.Product;
import com.improvement_app.food.entity.enums.ProductCategory;
import com.improvement_app.food.helpers.DriveFilesHelper;
import com.improvement_app.food.repository.ProductRepository;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.types.MimeType;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.ApplicationVariables.EXCEL_EXTENSION;
import static com.improvement_app.ApplicationVariables.PATH_TO_EXCEL_FILES;
import static com.improvement_app.food.FoodModuleVariable.DRIVE_PRODUCTS_SHEET_NAME;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService{

    private static final Logger LOGGER = Logger.getLogger(ProductServiceImpl.class);

    private ProductRepository productRepository;
    private final GoogleDriveFileService googleDriveFileService;

    @Override
    @Transactional
    public List<Product> initProducts() throws IOException {
        DriveFileItemDTO driveFileItemDTO = downloadNewProductsFile();

        final String filePath = PATH_TO_EXCEL_FILES + driveFileItemDTO.getName() + EXCEL_EXTENSION;
        final File file = new File(filePath);

        final List<Product> products = DriveFilesHelper.parseExcelProductsFile(file);

        LOGGER.info("Dodaje do bazy danych produkty: " + products);
        productRepository.saveAll(products);
        return products;
    }

    @Override
    @Transactional
    public List<Product> getProducts(ProductCategory productCategory, String productName) {
        final String productNameLower = productName.toLowerCase();
        if (productCategory == ProductCategory.ALL){
            return productRepository.findByName(productNameLower);
        }

        return productRepository.findProduct(productCategory, productNameLower);
    }

    private DriveFileItemDTO downloadNewProductsFile() throws IOException {
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(DRIVE_PRODUCTS_SHEET_NAME, MimeType.DRIVE_SHEETS);
        final DriveFileItemDTO driveFileItemDTO = new DriveFileItemDTO(DRIVE_PRODUCTS_SHEET_NAME, fileId, MimeType.DRIVE_SHEETS.getType());

        final String filePath = PATH_TO_EXCEL_FILES + driveFileItemDTO.getName() + EXCEL_EXTENSION;

        File file = new File(filePath);
        if (file.exists()){
            file.delete();
        }

        googleDriveFileService.downloadFile(driveFileItemDTO);

        return driveFileItemDTO;
    }

    @Override
    @Transactional
    public void deleteAllProducts() {
        productRepository.deleteAll();
    }

}
