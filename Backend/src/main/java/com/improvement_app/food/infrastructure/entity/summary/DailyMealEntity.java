package com.improvement_app.food.infrastructure.entity.summary;

import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import java.util.List;
import java.util.Objects;

@Audited
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_summary_id", nullable = false)
    private DietSummaryEntity dietSummary;

    @OneToMany(mappedBy = "dailyMeal", cascade = CascadeType.ALL, orphanRemoval = true)
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

        // Ustaw relację zwrotną
        if (mealIngredients != null) {
            for (DailyMealIngredientEntity ingredient : mealIngredients) {
                ingredient.setDailyMeal(this);
            }
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DailyMealEntity meal = (DailyMealEntity) o;
        return Double.compare(meal.cachedKcal, cachedKcal) == 0 && Double.compare(meal.cachedProtein, cachedProtein) == 0 &&
                Double.compare(meal.cachedCarbohydrates, cachedCarbohydrates) == 0 &&
                Double.compare(meal.cachedFat, cachedFat) == 0 &&
                Double.compare(meal.portionMultiplier, portionMultiplier) == 0 &&
                id.equals(meal.id) && name.equals(meal.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, cachedKcal, cachedProtein, cachedCarbohydrates, cachedFat, portionMultiplier);
    }
}