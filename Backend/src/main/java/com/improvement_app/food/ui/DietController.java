package com.improvement_app.food.ui;

import com.improvement_app.food.application.ports.in.DietSummaryManagementUseCase;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.EatenMeal;
import com.improvement_app.food.infrastructure.entity.EatenMealEntity;
import com.improvement_app.food.ui.requests.CalculateDietRequest;
import com.improvement_app.food.ui.requests.CreateDietSummaryRequest;
import com.improvement_app.food.ui.requests.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.UpdateDietSummaryRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/food/diet")
public class DietController {

    private final DietSummaryManagementUseCase dietSummaryManagementUseCase;

    @Operation(
            summary = "Pobieranie stronicowanej listy podsumowań diet",
            description = "Zwraca stronicowaną listę wszystkich podsumowań diet z możliwością sortowania"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista podsumowań diet została pomyślnie pobrana"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe parametry zapytania")
    })
    @GetMapping("/day-summary")
    public ResponseEntity<Page<DietSummary>> getDayDietSummary(
            @Parameter(description = "Numer strony (0-based)", example = "0")
            @RequestParam(defaultValue = "0") @Min(0) int page,

            @Parameter(description = "Liczba elementów na stronie", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) int size,

            @Parameter(description = "Pole do sortowania", example = "date")
            @RequestParam(defaultValue = "date") String sortField,

            @Parameter(description = "Kierunek sortowania", example = "DESC", schema = @Schema(allowableValues = {"ASC", "DESC"}))
            @RequestParam(defaultValue = "DESC") String direction) {

        log.debug("Fetching diet summaries - page: {}, size: {}, sortField: {}, direction: {}",
                page, size, sortField, direction);

        Sort.Direction sortDirection = Sort.Direction.valueOf(direction.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));
        Page<DietSummary> dietSummaries = dietSummaryManagementUseCase.getDietSummaries(pageable);

        log.debug("Found {} diet summaries on page {} of {}",
                dietSummaries.getNumberOfElements(), page, dietSummaries.getTotalPages());

        return ResponseEntity.ok(dietSummaries);
    }

    @Operation(
            summary = "Obliczanie podsumowania diety",
            description = "Oblicza podsumowanie diety na podstawie spożytych posiłków bez zapisywania wyniku"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Podsumowanie diety zostało pomyślnie obliczone"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe")
    })
    @PostMapping("/calculate")
    public ResponseEntity<DietSummary> calculateDietSummary(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Lista spożytych posiłków do obliczenia",
                    required = true
            )
            @Valid @RequestBody CalculateDietRequest calculateDietRequest) {

        log.debug("Calculating diet summary for {} meals", calculateDietRequest.eatenMeals().size());

        DietSummary dietSummaryEntity = dietSummaryManagementUseCase.calculateDietSummary(calculateDietRequest.eatenMeals());

        log.debug("Diet summary calculated - total calories: {}", dietSummaryEntity.kcal());

        return ResponseEntity.ok(dietSummaryEntity);
    }

    @Operation(
            summary = "Przeliczanie makroskładników posiłku",
            description = "Przelicza makroskładniki dla pojedynczego posiłku na podstawie nowych wartości"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Makroskładniki zostały pomyślnie przeliczone"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe")
    })
    @PostMapping("/meal/recalculate")
    public ResponseEntity<EatenMeal> recalculateMealMacro(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dane do przeliczenia makroskładników",
                    required = true
            )
            @Valid @RequestBody RecalculateMealMacroRequest recalculateRequest) {

        log.debug("Recalculating macro for meal with id: {}", recalculateRequest.eatenMeal().id());

        EatenMeal eatenMeal = dietSummaryManagementUseCase.recalculateMacro(recalculateRequest);

        log.debug("Meal macro recalculated - new calories: {}", eatenMeal.kcal());

        return ResponseEntity.ok(eatenMeal);
    }

    @Operation(
            summary = "Pobieranie szczegółów podsumowania diety",
            description = "Zwraca szczegóły podsumowania diety dla konkretnego dnia"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Szczegóły podsumowania diety zostały pomyślnie pobrane"),
            @ApiResponse(responseCode = "404", description = "Podsumowanie diety nie zostało znalezione"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowy identyfikator")
    })
    @GetMapping("/day-summary/{id}")
    public ResponseEntity<DietSummary> getDietDaySummary(
            @Parameter(description = "Identyfikator podsumowania diety", example = "1")
            @PathVariable @Min(1) Long id) {

        log.debug("Fetching diet summary for id: {}", id);

        DietSummary dayDietSummary = dietSummaryManagementUseCase.getDayDietSummary(id);

        log.debug("Diet summary found for id: {} with {} meals", id, dayDietSummary.meals().size());

        return ResponseEntity.ok(dayDietSummary);
    }

    @Operation(
            summary = "Tworzenie nowego podsumowania diety",
            description = "Tworzy nowe podsumowanie diety dla konkretnego dnia"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Podsumowanie diety zostało pomyślnie utworzone"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe"),
            @ApiResponse(responseCode = "409", description = "Podsumowanie dla danej daty już istnieje")
    })
    @PostMapping("/day-summary")
    public ResponseEntity<DietSummary> createDietDaySummary(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dane do utworzenia nowego podsumowania",
                    required = true
            )
            @Valid @RequestBody CreateDietSummaryRequest createRequest) {

        log.debug("Creating new diet summary for date: {}", LocalDate.now());

        DietSummary createdDiet = dietSummaryManagementUseCase.saveDietDaySummary(createRequest);

        log.info("Diet summary created with id: {} for date: {}",
                createdDiet.id(), createdDiet.date());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdDiet);
    }

    @Operation(
            summary = "Aktualizacja podsumowania diety",
            description = "Aktualizuje istniejące podsumowanie diety nowymi danymi"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Podsumowanie diety zostało pomyślnie zaktualizowane"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe"),
            @ApiResponse(responseCode = "404", description = "Podsumowanie diety nie zostało znalezione")
    })
    @PutMapping("/day-summary")
    public ResponseEntity<DietSummary> updateDietDaySummary(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dane do aktualizacji podsumowania",
                    required = true
            )
            @Valid @RequestBody UpdateDietSummaryRequest updateRequest) {

        log.debug("Updating diet summary with id: {}", updateRequest.dietSummaryId());

        DietSummary updatedDietSummaryEntity = dietSummaryManagementUseCase.updateDietSummary(updateRequest);

        log.info("Diet summary updated with id: {}, new total calories: {}",
                updatedDietSummaryEntity.id(), updatedDietSummaryEntity.kcal());

        return ResponseEntity.ok(updatedDietSummaryEntity);
    }

    @Operation(
            summary = "Usuwanie podsumowania diety",
            description = "Usuwa podsumowanie diety o podanym identyfikatorze"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Podsumowanie diety zostało pomyślnie usunięte"),
            @ApiResponse(responseCode = "404", description = "Podsumowanie diety nie zostało znalezione"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowy identyfikator")
    })
    @DeleteMapping("/day-summary/{id}")
    public ResponseEntity<Void> deleteDietDaySummary(
            @Parameter(description = "Identyfikator podsumowania do usunięcia", example = "1")
            @PathVariable @Min(1) Long id) {

        log.debug("Deleting diet summary with id: {}", id);

        dietSummaryManagementUseCase.deleteDietSummary(id);

        log.info("Diet summary deleted with id: {}", id);

        return ResponseEntity.noContent().build();
    }

}
