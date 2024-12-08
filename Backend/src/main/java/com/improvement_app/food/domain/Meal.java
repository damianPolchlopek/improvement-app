package com.improvement_app.food.domain;


import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import jakarta.persistence.*;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
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

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<MealIngredient> mealIngredients;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> recipe;

    @Enumerated(EnumType.STRING)
    private MealPopularity popularity;

    public Meal(Long id, String name, double kcal, double protein, double carbohydrates,
                double fat, double portionAmount, String url, MealType type,
                MealCategory category, MealPopularity popularity) {
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
        this.popularity = popularity;
    }

}
