package com.improvement_app.food.infrastructure.entity.meals;

import com.improvement_app.food.domain.enums.Unit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "meal_ingredient")
@Builder
public class MealIngredientEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
//    @JsonBackReference
    private MealRecipeEntity mealRecipeEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity productEntity;
    private String name;
    private double amount;

    public MealIngredientEntity(Long id, String name, double amount, Unit unit) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }

    @Enumerated(EnumType.STRING)
    private Unit unit;

    public MealIngredientEntity(ProductEntity productEntity, String name, double amount, Unit unit, MealRecipeEntity mealRecipeEntity) {
        this.productEntity = productEntity;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
        this.mealRecipeEntity = mealRecipeEntity;
    }

    @Override
    public String toString() {
        return "MealIngredient{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", amount=" + amount +
                ", unit=" + unit +
                ", productId=" + productEntity.getId() +
                '}';
    }
}
