package com.improvement_app.food.application;

import com.improvement_app.food.application.exceptions.DietSummaryNotFoundException;
import com.improvement_app.food.application.ports.in.DietSummaryManagementUseCase;
import com.improvement_app.food.application.ports.out.DietSummaryPersistencePort;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.ui.requests.create.CreateDietSummaryRequest;
import com.improvement_app.food.ui.requests.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.UpdateDietSummaryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DietSummaryService implements DietSummaryManagementUseCase {

    private final DietSummaryPersistencePort dietSummaryPersistencePort;
    private final CalculationMacroelementsService calculationMacroelementsService;

    public DietSummary saveDietDaySummary(Long userId, CreateDietSummaryRequest createDietSummaryRequest) {
        DietSummary dietSummary = calculateDietSummary(createDietSummaryRequest.toDailyMeals());
        return dietSummaryPersistencePort.save(userId, dietSummary);
    }

    public DietSummary calculateDietSummary(List<DailyMeal> dailyMeals) {
        return calculationMacroelementsService.recalculateDayMacro(dailyMeals);
    }

    public DailyMeal recalculateMacro(RecalculateMealMacroRequest calculateDietRequest) {
        DailyMeal dailyMeal = calculateDietRequest.dailyMeal();
        return calculationMacroelementsService.recalculateMealMacro(dailyMeal);
    }

    public Page<DietSummary> getDietSummaries(Long userId, Pageable pageable) {
        return dietSummaryPersistencePort.findAll(userId, pageable);
    }

    public void deleteDietSummary(Long userId, Long id) {
        dietSummaryPersistencePort.deleteById(userId, id);
    }

    public DietSummary getDayDietSummary(Long userId, Long id) {
        return dietSummaryPersistencePort.findById(userId, id)
                .orElseThrow(() -> new DietSummaryNotFoundException(id));
    }

    public DietSummary updateDietSummary(Long userId, UpdateDietSummaryRequest updateDietSummaryRequest) {
        DietSummary recalculatedDietSummary = calculateDietSummary(updateDietSummaryRequest.meals());

        long dietSummaryId = updateDietSummaryRequest.dietSummaryId();
        DietSummary oldDietSummary = dietSummaryPersistencePort.findById(userId, dietSummaryId)
                .orElseThrow(() -> new DietSummaryNotFoundException(dietSummaryId));

        DietSummary updated = oldDietSummary.update(recalculatedDietSummary);

        return dietSummaryPersistencePort.save(userId, updated);
    }
}
