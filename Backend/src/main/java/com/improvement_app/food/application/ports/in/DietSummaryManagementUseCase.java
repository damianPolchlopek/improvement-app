package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.EatenMeal;
import com.improvement_app.food.ui.requests.CreateDietSummaryRequest;
import com.improvement_app.food.ui.requests.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.UpdateDietSummaryRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DietSummaryManagementUseCase {
    Page<DietSummary> getDietSummaries(Long userId, Pageable pageable);

    DietSummary calculateDietSummary(List<EatenMeal> eatenMealEntities);

    EatenMeal recalculateMacro(RecalculateMealMacroRequest recalculateRequest);

    DietSummary getDayDietSummary(Long userId, Long id);

    DietSummary saveDietDaySummary(Long userId, CreateDietSummaryRequest createRequest);

    DietSummary updateDietSummary(Long userId, UpdateDietSummaryRequest updateRequest);

    void deleteDietSummary(Long userId, Long id);
}
