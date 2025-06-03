package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.ProductHandler;
import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.infrastructure.database.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Repository
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT)
@RequiredArgsConstructor
public class ProductHandlerImpl implements ProductHandler {

    private final ProductRepository productRepository;

    @Override
    public List<ProductEntity> findAll() {
        return productRepository.findAll();
    }

    @Override
    public void deleteAll() {
        productRepository.deleteAll();
    }

    @Override
    public List<ProductEntity> saveAll(List<ProductEntity> productEntities) {
        return productRepository.saveAll(productEntities);
    }

    @Override
    public List<ProductEntity> findByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<ProductEntity> findProduct(ProductCategory productCategory, String productName) {
        return productRepository.findProduct(productCategory, productName);
    }

}
