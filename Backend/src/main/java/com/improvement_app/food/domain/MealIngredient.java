package com.improvement_app.food.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.improvement_app.food.domain.enums.Unit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class MealIngredient {

    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    @JsonBackReference
    private MealRecipe mealRecipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;
    private String name;
    private double amount;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    public MealIngredient(Product product, String name, double amount, Unit unit) {
        this.product = product;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }

    @Override
    public String toString() {
        return "MealIngredient{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", amount=" + amount +
                ", unit=" + unit +
                '}';
    }
}
