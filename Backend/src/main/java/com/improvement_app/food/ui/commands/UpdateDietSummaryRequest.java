package com.improvement_app.food.ui.commands;

import java.util.List;

public record UpdateDietSummaryRequest(
        Long dietSummaryId,
        List<Long> meals
) {
}
