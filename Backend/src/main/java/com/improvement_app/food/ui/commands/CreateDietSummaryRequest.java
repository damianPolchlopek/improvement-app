package com.improvement_app.food.ui.commands;

import java.util.List;

public record CreateDietSummaryRequest(
        List<Long> meals
) {
}
