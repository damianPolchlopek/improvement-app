package com.improvement_app.audit.controller;

import com.improvement_app.audit.response.RevisionInfo;
import com.improvement_app.audit.response.AuditRevisionDto;
import com.improvement_app.audit.response.DietSummaryDto;
import com.improvement_app.audit.service.GenericAuditService;
import com.improvement_app.audit.response.AuditRevisionMetadata;
import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import com.improvement_app.security.entity.UserEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Audit", description = "API do przeglądania historii zmian")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audit")
public class AuditController {

    private final GenericAuditService auditService;

    @GetMapping("/{entityType}/{id}/revisions")
    @Operation(summary = "Lista wszystkich rewizji")
    public ResponseEntity<List<RevisionInfo>> getRevisions(
            @PathVariable String entityType,
            @PathVariable @Min(1) Long id) {

        Class<?> entityClass = resolveEntityClass(entityType);
        List<RevisionInfo> revisionHistory = auditService.getRevisionHistory(entityClass, id);

        return ResponseEntity.ok(revisionHistory);

    }

    @Operation(summary = "Pobierz metadane rewizji")
    @GetMapping("/revision/{revisionNumber}/metadata")
    public ResponseEntity<AuditRevisionMetadata> getRevisionMetadata(
            @PathVariable Integer revisionNumber) {

        AuditRevisionMetadata metadata = auditService.getRevisionMetadata(revisionNumber);
        return ResponseEntity.ok(metadata);
    }

    @Operation(summary = "Pobierz historię zmian DietSummary (tylko pola skalarne)")
    @GetMapping("/diet-summary/{id}/history")
    public ResponseEntity<List<AuditRevisionDto<DietSummaryDto>>> getDietHistory(
            @PathVariable Long id) {

        List<AuditRevisionDto<DietSummaryDto>> history =
                auditService.getEntityHistoryAsDto(
                        DietSummaryEntity.class,
                        id,
                        DietSummaryDto::from
                );

        return ResponseEntity.ok(history);
    }






    /**
     * Helper method - mapuje String entity type na konkretną klasę
     */
    private Class<?> resolveEntityClass(String entityType) {
        return switch (entityType.toLowerCase()) {
            // Food module
            case "diet-summary" -> DietSummaryEntity.class;
            case "daily-meal" -> DailyMealEntity.class;
            case "daily-meal-ingredient" -> DailyMealIngredientEntity.class;
            case "meal-recipe" -> MealRecipeEntity.class;
            case "product" -> ProductEntity.class;

            // User module
            case "user" -> UserEntity.class;

            default -> throw new IllegalArgumentException("Unknown entity type: " + entityType);
        };
    }
}