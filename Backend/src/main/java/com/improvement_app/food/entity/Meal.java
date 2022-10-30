package com.improvement_app.food.entity;

import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
    private double portionAmount;

    private String url;
    private MealCategory category;
    private MealType type;

    @OneToMany
    private List<ProductsMealSummary> productList = new ArrayList<>();

    public Meal(String name, double kcal, double protein, double carbohydrates,
                double fat, double portionAmount, String url, MealType type,
                MealCategory category) {
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

    @OneToMany
    private List<RecipeRow> recipe;

}
