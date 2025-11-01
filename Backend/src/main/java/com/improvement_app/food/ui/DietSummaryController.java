package com.improvement_app.food.ui;

import com.improvement_app.food.application.ports.in.DietSummaryManagementUseCase;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.ui.requests.CalculateDietRequest;
import com.improvement_app.food.ui.requests.create.CreateDietSummaryRequest;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/food/diet")
@PreAuthorize("hasRole('USER')") // Globalna ochrona dla całego kontrolera
public class DietSummaryController {

    private final DietSummaryManagementUseCase dietSummaryManagementUseCase;

    @Operation(
            summary = "Pobieranie stronicowanej listy podsumowań diet",
            description = "Zwraca stronicowaną listę podsumowań diet aktualnego użytkownika z możliwością sortowania"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista podsumowań diet została pomyślnie pobrana"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe parametry zapytania"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji")
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
            @RequestParam(defaultValue = "DESC") String direction,

            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} fetching diet summaries - page: {}, size: {}, sortField: {}, direction: {}",
                userId, page, size, sortField, direction);

        Sort.Direction sortDirection = Sort.Direction.valueOf(direction.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        Page<DietSummary> dietSummaries = dietSummaryManagementUseCase.getDietSummaries(userId, pageable);

        log.debug("User {} found {} diet summaries on page {} of {}",
                userId, dietSummaries.getNumberOfElements(), page, dietSummaries.getTotalPages());

        return ResponseEntity.ok(dietSummaries);
    }

    @Operation(
            summary = "Pobieranie szczegółów podsumowania diety",
            description = "Zwraca szczegóły podsumowania diety dla konkretnego dnia aktualnego użytkownika"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Szczegóły podsumowania diety zostały pomyślnie pobrane"),
            @ApiResponse(responseCode = "404", description = "Podsumowanie diety nie zostało znalezione"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowy identyfikator"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji"),
            @ApiResponse(responseCode = "403", description = "Brak dostępu do danych innego użytkownika")
    })
    @GetMapping("/day-summary/{id}")
    public ResponseEntity<DietSummary> getDietDaySummary(
            @Parameter(description = "Identyfikator podsumowania diety", example = "1")
            @PathVariable @Min(1) Long id,
            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} fetching diet summary for id: {}", userId, id);

        DietSummary dayDietSummary = dietSummaryManagementUseCase.getDayDietSummary(userId, id);

        log.debug("User {} diet summary found for id: {} with {} meals",
                userId, id, dayDietSummary.meals().size());

        return ResponseEntity.ok(dayDietSummary);
    }

    @Operation(
            summary = "Tworzenie nowego podsumowania diety",
            description = "Tworzy nowe podsumowanie diety dla konkretnego dnia aktualnego użytkownika"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Podsumowanie diety zostało pomyślnie utworzone"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe"),
            @ApiResponse(responseCode = "409", description = "Podsumowanie dla danej daty już istnieje"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji")
    })
    @PostMapping("/day-summary")
    public ResponseEntity<DietSummary> createDietDaySummary(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dane do utworzenia nowego podsumowania",
                    required = true
            )
            @Valid @RequestBody CreateDietSummaryRequest createRequest,
            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} creating new diet summary for date: {}", userId, LocalDate.now());

        DietSummary createdDiet = dietSummaryManagementUseCase.saveDietDaySummary(userId, createRequest);

        log.info("User {} diet summary created with id: {} for date: {}",
                userId, createdDiet.id(), createdDiet.date());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdDiet);
    }

    @Operation(
            summary = "Aktualizacja podsumowania diety",
            description = "Aktualizuje istniejące podsumowanie diety aktualnego użytkownika nowymi danymi"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Podsumowanie diety zostało pomyślnie zaktualizowane"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe"),
            @ApiResponse(responseCode = "404", description = "Podsumowanie diety nie zostało znalezione"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji"),
            @ApiResponse(responseCode = "403", description = "Brak dostępu do danych innego użytkownika")
    })
    @PutMapping("/day-summary")
    public ResponseEntity<DietSummary> updateDietDaySummary(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dane do aktualizacji podsumowania",
                    required = true
            )
            @Valid @RequestBody UpdateDietSummaryRequest updateRequest,
            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} updating diet summary with id: {}", userId, updateRequest.dietSummaryId());

        DietSummary updatedDietSummaryEntity
                = dietSummaryManagementUseCase.updateDietSummary(userId, updateRequest);

        log.info("User {} diet summary updated with id: {}, new total calories: {}",
                userId, updatedDietSummaryEntity.id(), updatedDietSummaryEntity.kcal());

        return ResponseEntity.ok(updatedDietSummaryEntity);
    }

    @Operation(
            summary = "Usuwanie podsumowania diety",
            description = "Usuwa podsumowanie diety aktualnego użytkownika o podanym identyfikatorze"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Podsumowanie diety zostało pomyślnie usunięte"),
            @ApiResponse(responseCode = "404", description = "Podsumowanie diety nie zostało znalezione"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowy identyfikator"),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji"),
            @ApiResponse(responseCode = "403", description = "Brak dostępu do danych innego użytkownika")
    })
    @DeleteMapping("/day-summary/{id}")
    public ResponseEntity<Void> deleteDietDaySummary(
            @Parameter(description = "Identyfikator podsumowania do usunięcia", example = "1")
            @PathVariable @Min(1) Long id,
            @AuthenticationPrincipal(expression = "id") Long userId) {

        log.debug("User {} deleting diet summary with id: {}", userId, id);

        dietSummaryManagementUseCase.deleteDietSummary(userId, id);

        log.info("User {} diet summary deleted with id: {}", userId, id);

        return ResponseEntity.noContent().build();
    }
}