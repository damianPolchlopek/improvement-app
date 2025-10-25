package com.improvement_app.food.infrastructure.googledrivefileparser.initializers;

import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.food.infrastructure.database.ProductRepository;
import com.improvement_app.googledrive.service.FileDownloadService;
import com.improvement_app.food.infrastructure.googledrivefileparser.parsers.ProductParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.improvement_app.food.FoodModuleVariables.PRODUCTS_SHEET_NAME;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductInitializer {

    private final FileDownloadService fileDownloadService;
    private final ProductParser productParser;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String PRODUCTS_PROCESSING_MESSAGE = "Processing products from file: {}";
    private static final String PRODUCTS_SAVED_MESSAGE = "Successfully saved {} products to database";

    public List<ProductEntity> initializeProducts() throws IOException {
        log.info(PRODUCTS_PROCESSING_MESSAGE, PRODUCTS_SHEET_NAME);
        messagingTemplate.convertAndSend("/topic/messages", "Loading products...");

        try {
            File productsFile = fileDownloadService.downloadFile(PRODUCTS_SHEET_NAME);
            List<ProductEntity> productEntities = productParser.parseExcelProductsFile(productsFile);

            validateProducts(productEntities);
            List<ProductEntity> savedProducts = productRepository.saveAll(productEntities);

            log.info(PRODUCTS_SAVED_MESSAGE, savedProducts.size());
            messagingTemplate.convertAndSend("/topic/messages",
                    String.format("Loaded %d products", savedProducts.size()));

            return savedProducts;

        } catch (IOException e) {
            log.error("Failed to initialize products from file: {}", PRODUCTS_SHEET_NAME, e);
            throw new IOException("Products initialization failed", e);
        }
    }

    private void validateProducts(List<ProductEntity> products) {
        if (products == null || products.isEmpty()) {
            throw new IllegalStateException("No products found in file: " + PRODUCTS_SHEET_NAME);
        }

        long invalidProducts = products.stream()
                .filter(product -> product.getName() == null || product.getName().trim().isEmpty())
                .count();

        if (invalidProducts > 0) {
            log.warn("Found {} products with invalid names", invalidProducts);
        }
    }
}