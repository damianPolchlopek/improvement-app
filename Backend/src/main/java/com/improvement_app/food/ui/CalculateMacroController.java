package com.improvement_app.food.ui;

import com.improvement_app.food.application.ports.in.CalculationManagementUseCase;
import com.improvement_app.food.domain.calculate.CalculateResult;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.ui.requests.calculate.CalculateDietRequest;
import com.improvement_app.food.ui.requests.calculate.RecalculateMealMacroRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "Calculate Macro", description = "API do obliczania makroskładników posiłków")
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/food/macro")
public class CalculateMacroController {

    private final CalculationManagementUseCase calculationManagementUseCase;


    @Operation(
            summary = "Obliczanie podsumowania diety",
            description = "Oblicza podsumowanie diety na podstawie spożytych posiłków bez zapisywania wyniku"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Podsumowanie diety zostało pomyślnie obliczone"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji")
    })
    @PostMapping("/calculate")
    public ResponseEntity<CalculateResult> calculateDietSummary(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Lista spożytych posiłków do obliczenia",
                    required = true
            )
            @Valid @RequestBody CalculateDietRequest calculateDietRequest,
            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} calculating diet summary for {} meals",
                userId, calculateDietRequest.dailyMeals().size());

        CalculateResult dietSummaryEntity = calculationManagementUseCase.calculateDayMacro(calculateDietRequest);

        log.debug("User {} diet summary calculated - total calories: {}",
                userId, dietSummaryEntity.kcal());

        return ResponseEntity.ok(dietSummaryEntity);
    }

    @Operation(
            summary = "Przeliczanie makroskładników posiłku",
            description = "Przelicza makroskładniki dla pojedynczego posiłku na podstawie nowych wartości"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Makroskładniki zostały pomyślnie przeliczone"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji"),
            @ApiResponse(responseCode = "403", description = "Brak dostępu do posiłku innego użytkownika")
    })
    @PostMapping("/meal/recalculate")
    public ResponseEntity<CalculateResult> recalculateMealMacro(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dane do przeliczenia makroskładników",
                    required = true
            )
            @Valid @RequestBody RecalculateMealMacroRequest recalculateRequest,
            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} recalculating macro for meal {}",
                userId, recalculateRequest.dailyMeal());

        CalculateResult result = calculationManagementUseCase.recalculateMealMacro(recalculateRequest);

        log.debug("User {} meal macro recalculated - new calories: {}",
                userId, result.kcal());

        return ResponseEntity.ok(result);
    }
}
