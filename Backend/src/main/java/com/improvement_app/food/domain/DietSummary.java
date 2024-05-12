package com.improvement_app.food.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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

    @Type(type = "jsonb")
    private List<Meal> meals;

    public DietSummary(double kcal, double protein, double carbohydrates, double fat, List<Meal> meals) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.date = LocalDate.now();
        this.meals = meals;
    }
}
