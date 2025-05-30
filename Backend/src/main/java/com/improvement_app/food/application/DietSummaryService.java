package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.DietSummaryHandler;
import com.improvement_app.food.domain.dietsummary.DietSummary;
import com.improvement_app.food.domain.dietsummary.EatenMeal;
import com.improvement_app.food.ui.commands.CreateDietSummaryRequest;
import com.improvement_app.food.ui.commands.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.commands.UpdateDietSummaryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DietSummaryService {

    private final DietSummaryHandler dietSummaryHandler;
    private final CalculationMacroelementsService calculationMacroelementsService;


    @Transactional
    public DietSummary saveDietDaySummary(CreateDietSummaryRequest createDietSummaryRequest) {
        DietSummary dietSummary = calculateDietSummary(createDietSummaryRequest.meals());
        return dietSummaryHandler.save(dietSummary);
    }

    public DietSummary calculateDietSummary(List<EatenMeal> mealsId) {
        double kcal = 0;
        double protein = 0;
        double carbs = 0;
        double fat = 0;

        for (EatenMeal eatenMeal : mealsId) {
            final double amount = eatenMeal.amount();

            kcal += amount * eatenMeal.kcal();
            protein += amount * eatenMeal.protein();
            carbs += amount * eatenMeal.carbohydrates();
            fat += amount * eatenMeal.fat();
        }

        return new DietSummary(kcal, protein, carbs, fat, mealsId);
    }

    @Transactional
    public EatenMeal recalculateMacro(RecalculateMealMacroRequest calculateDietRequest) {
        EatenMeal eatenMeal = calculateDietRequest.eatenMeal();
        EatenMeal eatenMeal1 = calculationMacroelementsService.recalculateMealMacro(eatenMeal);
        System.out.println(eatenMeal1);
        return eatenMeal1;
    }

    @Transactional
    public Page<DietSummary> getDietSummaries(Pageable pageable) {
        return dietSummaryHandler.findAll(pageable);
    }

    public void deleteDietSummary(Long id) {
        dietSummaryHandler.deleteById(id);
    }

    public DietSummary getDayDietSummary(Long id) {
        return dietSummaryHandler.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono podsumowania diety o id: " + id));
    }

    public DietSummary updateDietSummary(UpdateDietSummaryRequest updateDietSummaryRequest) {
        DietSummary recalculatedDietSummary = calculateDietSummary(updateDietSummaryRequest.meals());

        DietSummary oldDietSummary = dietSummaryHandler.findById(updateDietSummaryRequest.dietSummaryId())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono podsumowania diety o id: " + updateDietSummaryRequest.dietSummaryId()));

        oldDietSummary.update(recalculatedDietSummary);

        return dietSummaryHandler.save(oldDietSummary);
    }
}
