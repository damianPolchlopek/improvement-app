package com.improvement_app.food.domain.dietsummary;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class DietSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;

    private LocalDate date;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<EatenMeal> meals;

    public DietSummary(double kcal, double protein,
                       double carbohydrates, double fat,
                       List<EatenMeal> mealRecipes) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.date = LocalDate.now();
        this.meals = mealRecipes;
    }

    public DietSummary update(DietSummary newDietSummary) {
        this.kcal = newDietSummary.kcal;
        this.protein = newDietSummary.protein;
        this.carbohydrates = newDietSummary.carbohydrates;
        this.fat = newDietSummary.fat;
        this.date = LocalDate.now();
        this.meals = newDietSummary.meals;
        return this;
    }
}
