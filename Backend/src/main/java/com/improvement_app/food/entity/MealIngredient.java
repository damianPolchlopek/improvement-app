package com.improvement_app.food.entity;

import com.improvement_app.food.entity.enums.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class MealIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int productId;
    private String name;
    private double amount;
    private Unit unit;

    public MealIngredient(int productId, String name, double amount, Unit unit) {
        this.productId = productId;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }

    public MealIngredient(MealIngredient mealIngredient) {
        this.productId = mealIngredient.getProductId();
        this.name = mealIngredient.getName();
        this.amount = mealIngredient.getAmount();
        this.unit = mealIngredient.getUnit();
    }
}
