package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.calculate.CalculateResult;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.ui.requests.calculate.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateDietRequest;

public interface CalculationManagementUseCase {
    CalculateResult calculateDayMacro(CalculateDietRequest dailyMealEntities);

    CalculateResult recalculateMealMacro(RecalculateMealMacroRequest recalculateRequest);
}
