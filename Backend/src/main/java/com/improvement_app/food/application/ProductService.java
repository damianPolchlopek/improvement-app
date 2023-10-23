package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.ProductGoogleDriveHandler;
import com.improvement_app.food.application.ports.ProductHandler;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.enums.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductHandler productHandler;
    private final ProductGoogleDriveHandler productGoogleDriveHandler;

    public void initProducts() throws IOException {
        List<Product> products = productGoogleDriveHandler.findAll();
        productHandler.saveAll(products);
    }

    public List<Product> getProducts(ProductCategory productCategory, String productName) {
        final String productNameLower = productName.toLowerCase();
        if (productCategory == ProductCategory.ALL) {
            return productHandler.findByName(productNameLower);
        }

        return productHandler.findProduct(productCategory, productNameLower);
    }

    public void deleteAll() {
        productHandler.deleteAll();
    }

}
