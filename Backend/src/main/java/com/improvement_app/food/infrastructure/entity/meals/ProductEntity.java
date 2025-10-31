package com.improvement_app.food.infrastructure.entity.meals;

import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.domain.enums.Unit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product", schema = "food")
@Builder
public class ProductEntity {

    @Id
    private Long id;

    private String name;
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
    private double amount;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    @Enumerated(EnumType.STRING)
    private ProductCategory productCategory;

}
