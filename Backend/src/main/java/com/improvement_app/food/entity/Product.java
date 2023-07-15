package com.improvement_app.food.entity;

import com.improvement_app.food.entity.enums.ProductCategory;
import com.improvement_app.food.entity.enums.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product{

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

    public Product(String name) {
        this.name = name;
    }

}
