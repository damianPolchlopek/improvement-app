package com.improvement_app.food.infrastructure.database;

import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.domain.enums.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    @Query("SELECT p FROM ProductEntity p WHERE LOWER(p.name) LIKE %:productName% ORDER BY p.name")
    List<ProductEntity> findByName(String productName);

    @Query("SELECT p FROM ProductEntity p WHERE p.productCategory = :productCategory AND LOWER(p.name) LIKE %:productName% " +
            "ORDER BY p.name")
    List<ProductEntity> findProduct(ProductCategory productCategory, String productName);
}
