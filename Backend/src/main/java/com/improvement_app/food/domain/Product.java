package com.improvement_app.food.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.domain.enums.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product {

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

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<MealIngredient> mealIngredients;

    public Product(Long id, String name, double kcal, double protein, double carbohydrates,
                   double fat, double amount, Unit unit, ProductCategory productCategory) {
        this.id = id;
        this.name = name;
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.amount = amount;
        this.unit = unit;
        this.productCategory = productCategory;
    }
}
