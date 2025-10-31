package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.ui.requests.create.CreateDietSummaryRequest;
import com.improvement_app.food.ui.requests.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.UpdateDietSummaryRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DietSummaryManagementUseCase {
    Page<DietSummary> getDietSummaries(Long userId, Pageable pageable);

    DietSummary calculateDietSummary(List<DailyMeal> dailyMealEntities);

    DailyMeal recalculateMacro(RecalculateMealMacroRequest recalculateRequest);

    DietSummary getDayDietSummary(Long userId, Long id);

    DietSummary saveDietDaySummary(Long userId, CreateDietSummaryRequest createRequest);

    DietSummary updateDietSummary(Long userId, UpdateDietSummaryRequest updateRequest);

    void deleteDietSummary(Long userId, Long id);
}
