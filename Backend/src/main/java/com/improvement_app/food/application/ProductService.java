package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.in.ProductManagementUseCase;
import com.improvement_app.food.application.ports.out.ProductPersistencePort;
import com.improvement_app.food.domain.recipe.Product;
import com.improvement_app.food.domain.enums.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements ProductManagementUseCase {

    private final ProductPersistencePort productHandler;

    @Override
    public List<Product> getProducts(ProductCategory productCategory, String productName) {
        final String productNameLower = productName.toLowerCase();
        if (productCategory == ProductCategory.ALL) {
            return productHandler.findByName(productNameLower);
        }

        return productHandler.findProduct(productCategory, productNameLower);
    }

    @Override
    public List<String> getAvailableCategories() {
        return Arrays.stream(ProductCategory.values())
                .map(ProductCategory::getName)
                .sorted()
                .toList();
    }
}
