package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.calculate.CalculateResult;
import com.improvement_app.food.ui.requests.calculate.CalculateDietRequest;
import com.improvement_app.food.ui.requests.calculate.RecalculateMealMacroRequest;

public interface CalculationManagementUseCase {
    CalculateResult calculateDayMacro(CalculateDietRequest dailyMealEntities);

    CalculateResult recalculateMealMacro(RecalculateMealMacroRequest recalculateRequest);
}
