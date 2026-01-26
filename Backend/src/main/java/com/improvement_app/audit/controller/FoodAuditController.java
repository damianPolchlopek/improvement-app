package com.improvement_app.audit.controller;

import com.improvement_app.audit.response.AuditRevisionDto;
import com.improvement_app.audit.response.DietSummaryAuditDto;
import com.improvement_app.audit.response.DietSummaryWithMealsDto;
import com.improvement_app.audit.service.FoodAuditService;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Audit", description = "API do przeglądania historii zmian food")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audit/food")
public class FoodAuditController {

    private final FoodAuditService foodAuditService;

    @GetMapping("/diet-summary/{id}/{revision}")
    public ResponseEntity<DietSummaryWithMealsDto> getDietHistory2(@PathVariable Long id,
                                                                   @PathVariable Number revision) {

        DietSummaryWithMealsDto history =
                foodAuditService.getFullSnapshotAtRevision(
                        id,
                        revision
                );

        return ResponseEntity.ok(history);
    }

    @Operation(summary = "Pobierz historię zmian DietSummary (tylko pola skalarne)")
    @GetMapping("/diet-summary/{id}/history")
    public ResponseEntity<List<AuditRevisionDto<DietSummaryAuditDto>>> getDietHistory(
            @PathVariable Long id) {

        List<AuditRevisionDto<DietSummaryAuditDto>> history =
                foodAuditService.getEntityHistoryAsDto(
                        DietSummaryEntity.class,
                        id,
                        DietSummaryAuditDto::from
                );

        return ResponseEntity.ok(history);
    }

}
