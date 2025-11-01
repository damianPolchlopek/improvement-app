package com.improvement_app.food.domain.summary;

import com.improvement_app.food.domain.calculate.CalculateResult;

import java.time.LocalDate;
import java.util.List;

public record DietSummary(
        Long id,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        LocalDate date,
        List<DailyMeal> meals
) {

        public DietSummary(double kcal, double protein,
                        double carbohydrates, double fat,
                        List<DailyMeal> meals) {
            this(null, kcal, protein, carbohydrates, fat, LocalDate.now(), meals);
        }

        public DietSummary update(CalculateResult calculateResult) {
            return new DietSummary(
                    this.id,
                    calculateResult.kcal(),
                    calculateResult.protein(),
                    calculateResult.carbohydrates(),
                    calculateResult.fat(),
                    this.date,
                    this.meals
            );
        }
}
