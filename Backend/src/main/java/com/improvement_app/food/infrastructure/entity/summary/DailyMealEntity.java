package com.improvement_app.food.infrastructure.entity.summary;

import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "daily_meal", schema = "food")
public class DailyMealEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double cachedKcal;
    private double cachedProtein;
    private double cachedCarbohydrates;
    private double cachedFat;
    private double portionMultiplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_recipe_id")
    private MealRecipeEntity recipeEntity;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "daily_meal_id")
    private List<DailyMealIngredientEntity> mealIngredients;

    public DailyMealEntity(Long id, String name, double cachedKcal, double cachedProtein,
                           double cachedCarbohydrates, double cachedFat, double portionMultiplier,
                           List<DailyMealIngredientEntity> mealIngredients) {
        this.id = id;
        this.name = name;
        this.cachedKcal = cachedKcal;
        this.cachedProtein = cachedProtein;
        this.cachedCarbohydrates = cachedCarbohydrates;
        this.cachedFat = cachedFat;
        this.portionMultiplier = portionMultiplier;
        this.mealIngredients = mealIngredients;
    }

    @Override
    public String toString() {
        return "EatenMealEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", kcal=" + cachedKcal +
                ", protein=" + cachedProtein +
                ", carbohydrates=" + cachedCarbohydrates +
                ", fat=" + cachedFat +
                ", portionMultiplier=" + portionMultiplier +
                '}';
    }
}