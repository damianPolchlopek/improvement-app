package com.improvement_app.audit.response;

import java.util.List;

public record RevisionComparisonDTO(
        RevisionDataDTO olderRevision,
        RevisionDataDTO newerRevision,
        MacroChangesDTO macroChanges,
        List<DailyMealDto> mealsAdded,
        List<DailyMealDto> mealsRemoved,
        List<ModifiedMealDTO> mealsModified
) {

    public record RevisionDataDTO(
            Integer revisionNumber,
            String revisionTimestamp,
            DietSummaryDto dietSummary
    ) {}

    public record MacroChangesDTO(
            MacroChangeDetailDTO kcal,
            MacroChangeDetailDTO protein,
            MacroChangeDetailDTO carbohydrates,
            MacroChangeDetailDTO fat
    ) {}

    public record MacroChangeDetailDTO(
            Double oldValue,
            Double newValue,
            Double diff,
            Double percentChange
    ) {}

    public record ModifiedMealDTO(
            DailyMealDto meal,
            MealChangesDTO changes
    ) {}

    public record MealChangesDTO(
            boolean hasChanges,
            boolean portionChanged,
            MacrosChangedDTO macrosChanged,
            List<IngredientDto> ingredientsAdded,
            List<IngredientDto> ingredientsRemoved,
            List<ModifiedIngredientDTO> ingredientsModified
    ) {}

    public record MacrosChangedDTO(
            boolean kcal,
            boolean protein,
            boolean carbohydrates,
            boolean fat
    ) {}

    public record ModifiedIngredientDTO(
            IngredientDto ingredient,
            Double oldAmount,
            Double newAmount
    ) {}
}
