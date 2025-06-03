package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.ProductHandler;
import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.domain.enums.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductHandler productHandler;

    public List<ProductEntity> getProducts(ProductCategory productCategory, String productName) {
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
