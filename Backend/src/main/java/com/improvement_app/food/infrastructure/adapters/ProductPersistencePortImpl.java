package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.out.ProductPersistencePort;
import com.improvement_app.food.domain.recipe.Product;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.infrastructure.repository.ProductRepository;
import com.improvement_app.food.infrastructure.mappers.ProductMapper;
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
public class ProductPersistencePortImpl implements ProductPersistencePort {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<Product> findAll() {
        List<ProductEntity> entities = productRepository.findAll();
        return productMapper.toDomain(entities);
    }

    @Override
    public void deleteAll() {
        productRepository.deleteAll();
    }

    @Override
    public List<Product> saveAll(List<Product> productEntities) {
        List<ProductEntity> entities = productMapper.toEntity(productEntities);
        List<ProductEntity> saved = productRepository.saveAll(entities);
        return productMapper.toDomain(saved);
    }

    @Override
    public List<Product> findByName(String name) {
        List<ProductEntity> entities = productRepository.findByName(name);
        return productMapper.toDomain(entities);
    }

    @Override
    public List<Product> findProduct(ProductCategory productCategory, String productName) {
        List<ProductEntity> entities = productRepository.findProduct(productCategory, productName);
        return productMapper.toDomain(entities);
    }

}
