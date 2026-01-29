package com.improvement_app.audit.controller;

import com.improvement_app.audit.response.DietSummaryRevision;
import com.improvement_app.audit.response.RevisionComparisonDTO;
import com.improvement_app.audit.service.FoodAuditService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Audit", description = "API do przeglądania historii zmian food")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audit/food")
public class FoodAuditController {

    private final FoodAuditService foodAuditService;

    @GetMapping("/diet-summary/{id}/{revision}")
    public ResponseEntity<DietSummaryRevision> getDietHistory(@PathVariable Long id,
                                                              @PathVariable Number revision) {

        DietSummaryRevision history =
                foodAuditService.getFullSnapshotAtRevision(
                        id,
                        revision
                );

        return ResponseEntity.ok(history);
    }

    @GetMapping("/diet-summary/{dietSummaryId}/revisions/compare")
    public ResponseEntity<RevisionComparisonDTO> compareRevisions(
            @PathVariable Long dietSummaryId,
            @RequestParam Integer olderRevision,
            @RequestParam Integer newerRevision
    ) {
        RevisionComparisonDTO comparison = foodAuditService.compareRevisions(
                dietSummaryId,
                olderRevision,
                newerRevision
        );
        return ResponseEntity.ok(comparison);
    }


}
