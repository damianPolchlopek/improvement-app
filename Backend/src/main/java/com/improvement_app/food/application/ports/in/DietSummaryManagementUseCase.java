package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.EatenMeal;
import com.improvement_app.food.infrastructure.entity.EatenMealEntity;
import com.improvement_app.food.ui.requests.CreateDietSummaryRequest;
import com.improvement_app.food.ui.requests.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.UpdateDietSummaryRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DietSummaryManagementUseCase {
    Page<DietSummary> getDietSummaries(Pageable pageable);

    DietSummary calculateDietSummary(List<EatenMeal> eatenMealEntities);

    EatenMeal recalculateMacro(RecalculateMealMacroRequest recalculateRequest);

    DietSummary getDayDietSummary(Long id);

    DietSummary saveDietDaySummary(CreateDietSummaryRequest createRequest);

    DietSummary updateDietSummary(UpdateDietSummaryRequest updateRequest);

    void deleteDietSummary(Long id);
}
