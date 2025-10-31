package com.improvement_app.food.infrastructure.entity.summary;

import com.improvement_app.food.domain.enums.Unit;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "daily_meal_ingredient", schema = "food")
public class DailyMealIngredientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    private String name;
    private double amount;
    @Enumerated(EnumType.STRING)
    private Unit unit;

    public DailyMealIngredientEntity(Long id, String name, double amount, Unit unit) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
}
