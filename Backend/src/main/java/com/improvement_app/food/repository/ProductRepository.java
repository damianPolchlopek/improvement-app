package com.improvement_app.food.repository;

import com.improvement_app.food.entity.Product;
import com.improvement_app.food.entity.enums.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE %:productName% ORDER BY p.name")
    List<Product> findByName(String productName);

    @Query("SELECT p FROM Product p WHERE p.productCategory = :productCategory AND LOWER(p.name) LIKE %:productName% ORDER BY p.name")
    List<Product> findProduct(ProductCategory productCategory, String productName);
}
