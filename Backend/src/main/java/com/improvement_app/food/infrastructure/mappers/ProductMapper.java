package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.Product;
import com.improvement_app.food.infrastructure.entity.ProductEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public Product toDomain(ProductEntity entity) {
        if (entity == null) {
            return null;
        }

        return new Product(
                entity.getId(),
                entity.getName(),
                entity.getKcal(),
                entity.getProtein(),
                entity.getCarbohydrates(),
                entity.getFat(),
                entity.getAmount(),
                entity.getUnit(),
                entity.getProductCategory()
        );
    }

    public ProductEntity toEntity(Product product) {
        if (product == null) {
            return null;
        }

        return new ProductEntity(
                product.id(),
                product.name(),
                product.kcal(),
                product.protein(),
                product.carbohydrates(),
                product.fat(),
                product.amount(),
                product.unit(),
                product.productCategory()
        );
    }

    public List<Product> toDomain(List<ProductEntity> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    public List<ProductEntity> toEntity(List<Product> products) {
        if (products == null) {
            return List.of();
        }

        return products.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
