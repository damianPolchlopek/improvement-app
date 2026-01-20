package com.improvement_app.common.audit;

import com.improvement_app.common.audit.dto.AuditChanges;
import com.improvement_app.common.audit.dto.AuditRevisionInfo;
import com.improvement_app.common.audit.dto.AuditRevisionMetadata;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.security.entity.UserEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Tag(name = "Audit", description = "API do przeglądania historii zmian")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final GenericAuditService auditService;

    @Operation(summary = "Pobierz pełną historię zmian dla encji")
    @GetMapping("/{entityType}/{entityId}/history")
    public ResponseEntity<List<? extends AuditRevisionInfo<?>>> getEntityHistory(
            @PathVariable String entityType,
            @PathVariable Long entityId) {

        Class<?> entityClass = resolveEntityClass(entityType);
        List<? extends AuditRevisionInfo<?>> history = auditService.getEntityHistory(entityClass, entityId);

        return ResponseEntity.ok(history);
    }

    @Operation(summary = "Pobierz zmiany w konkretnej rewizji")
    @GetMapping("/{entityType}/{entityId}/revision/{revisionNumber}")
    public ResponseEntity<AuditChanges<?>> getRevisionChanges(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable Integer revisionNumber) {

        Class<?> entityClass = resolveEntityClass(entityType);
        AuditChanges<?> changes = auditService.getRevisionChanges(entityClass, entityId, revisionNumber);

        return ResponseEntity.ok(changes);
    }

    @Operation(summary = "Porównaj dwie rewizje")
    @GetMapping("/{entityType}/{entityId}/compare")
    public ResponseEntity<AuditChanges<?>> compareRevisions(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestParam Integer oldRevision,
            @RequestParam Integer newRevision) {

        Class<?> entityClass = resolveEntityClass(entityType);
        AuditChanges<?> changes = auditService.getChangesBetweenRevisions(
                entityClass, entityId, oldRevision, newRevision);

        return ResponseEntity.ok(changes);
    }

    @Operation(summary = "Pobierz metadane rewizji")
    @GetMapping("/revision/{revisionNumber}/metadata")
    public ResponseEntity<AuditRevisionMetadata> getRevisionMetadata(
            @PathVariable Integer revisionNumber) {

        AuditRevisionMetadata metadata = auditService.getRevisionMetadata(revisionNumber);
        return ResponseEntity.ok(metadata);
    }

    @Operation(summary = "Pobierz zmiany użytkownika w określonym czasie")
    @GetMapping("/{entityType}/user/{username}")
    public ResponseEntity<List<? extends AuditRevisionInfo<?>>> getUserChanges(
            @PathVariable String entityType,
            @PathVariable String username,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {

        Class<?> entityClass = resolveEntityClass(entityType);
        List<? extends AuditRevisionInfo<?>> changes = auditService.getUserChanges(entityClass, username, from, to);

        return ResponseEntity.ok(changes);
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

            // Można dodać więcej według potrzeb

            default -> throw new IllegalArgumentException("Unknown entity type: " + entityType);
        };
    }
}