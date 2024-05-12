package com.improvement_app.food.domain;


import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealType;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class Meal {

    @Id
    private Long id;

    private String name;
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
    private double portionAmount;

    private String url;

    @Enumerated(EnumType.STRING)
    private MealCategory category;

    @Enumerated(EnumType.STRING)
    private MealType type;

    @Type(type = "jsonb")
    private List<MealIngredient> mealIngredients;

    @Type(type = "jsonb")
    private List<String> recipe;

    public Meal(Long id, String name, double kcal, double protein, double carbohydrates,
                double fat, double portionAmount, String url, MealType type,
                MealCategory category) {
        this.id = id;
        this.name = name;
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.portionAmount = portionAmount;
        this.url = url;
        this.type = type;
        this.category = category;
    }

}
