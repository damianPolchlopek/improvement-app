package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.ProductHandler;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.infrastructure.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Slf4j
@Repository
@Transactional
@RequiredArgsConstructor
public class ProductHandlerImpl implements ProductHandler {

    private final ProductRepository productRepository;

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public void deleteAll() {
        productRepository.deleteAll();
    }

    @Override
    public void saveAll(List<Product> products) {
        productRepository.saveAll(products);
    }

    @Override
    public List<Product> findByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> findProduct(ProductCategory productCategory, String productName) {
        return productRepository.findProduct(productCategory, productName);
    }

}
