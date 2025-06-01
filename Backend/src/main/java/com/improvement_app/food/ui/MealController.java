package com.improvement_app.food.ui;

import com.improvement_app.exceptions.ErrorResponse;
import com.improvement_app.food.application.MealService;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.food.ui.response.GetMealResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@Tag(name = "Meals", description = "API do zarządzania posiłkami")
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class MealController {

    private final MealService mealService;

    @GetMapping("/meal")
    @Operation(
            summary = "Pobierz listę posiłków",
            description = "Zwraca listę posiłków na podstawie podanych kryteriów wyszukiwania i sortowania"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista posiłków została pomyślnie pobrana",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GetMealResponse.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Nieprawidłowe parametry wyszukiwania",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<List<GetMealResponse>> getMeals(
            @Parameter(description = "Nazwa posiłku", required = true, example = "Spaghetti Carbonara")
            String mealName,

            @Parameter(description = "Kategoria posiłku", required = true, example = "LUNCH")
            @RequestParam
            @NotBlank(message = "Kategoria posiłku nie może być pusta")
            String mealCategory,

            @Parameter(description = "Typ posiłku", required = true, example = "DINNER")
            @RequestParam
            @NotBlank(message = "Typ posiłku nie może być pusta")
            String mealType,

            @Parameter(description = "Popularność posiłku", required = true, example = "HIGH")
            @RequestParam
            @NotBlank(message = "Popularność posiłku nie może być pusta")
            String mealPopularity,

            @Parameter(description = "Pole sortowania", required = true, example = "name")
            @RequestParam
            @NotBlank(message = "Pole sortowania nie może być puste")
            @Pattern(regexp = "^(name|popularity|category|type)$",
                    message = "Dozwolone wartości sortowania: name, popularity, category, type")
            String sortBy,

            @Parameter(description = "Czy pokazać tylko posiłki na jedną porcję", example = "false")
            @RequestParam(defaultValue = "false")
            @NotNull(message = "Parametr onOnePortion nie może być null")
            Boolean onOnePortion)
    {
        MealCategory mealCategoryEnum = MealCategory.fromValue(mealCategory);
        MealType mealTypeEnum = MealType.fromValue(mealType);
        MealPopularity mealPopularityEnum = MealPopularity.fromValue(mealPopularity);

        List<GetMealResponse> mealDTOs = mealService.getMeals(mealCategoryEnum, mealTypeEnum,
                        mealPopularityEnum, mealName, sortBy, onOnePortion)
                .stream()
                .map(GetMealResponse::from)
                .toList();

        return ResponseEntity.ok(mealDTOs);
    }

    @GetMapping("/meal/categories")
    @Operation(
            summary = "Pobierz dostępne kategorie posiłków",
            description = "Zwraca listę wszystkich dostępnych kategorii posiłków"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista kategorii została pomyślnie pobrana",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(type = "string"))
                    )
            )
    })
    public ResponseEntity<String[]> getMealCategories() {
        String[] categories = Arrays.stream(MealCategory.values())
                .map(MealCategory::getName)
                .toArray(String[]::new);

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/meal/types")
    @Operation(
            summary = "Pobierz dostępne typy posiłków",
            description = "Zwraca listę wszystkich dostępnych typów posiłków"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista typów została pomyślnie pobrana",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(type = "string"))
                    )
            )
    })
    public ResponseEntity<String[]> getMealTypes() {
        String[] types = Arrays.stream(MealType.values())
                .map(MealType::getName)
                .toArray(String[]::new);

        return ResponseEntity.ok(types);
    }

}
