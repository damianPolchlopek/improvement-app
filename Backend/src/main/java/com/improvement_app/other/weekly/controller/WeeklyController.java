package com.improvement_app.other.weekly.controller;

import com.improvement_app.common.web.ApiVersions;
import com.improvement_app.other.weekly.entity.Category;
import com.improvement_app.other.weekly.request.WeeklyRecordRequest;
import com.improvement_app.other.weekly.response.WeeklyRecordResponse;
import com.improvement_app.other.weekly.service.WeeklyService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(ApiVersions.V1 + "/weekly")
public class WeeklyController {

    private final WeeklyService weeklyService;

    @GetMapping("/{category}")
    public ResponseEntity<List<WeeklyRecordResponse>> getWeekly(
            @PathVariable Category category,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        return ResponseEntity.ok(weeklyService.getWeeklyRecords(userId, category));
    }

    @GetMapping("/categories")
    public ResponseEntity<Category[]> getAllCategoryType() {
        return ResponseEntity.ok(Category.values());
    }

    @PostMapping
    public ResponseEntity<WeeklyRecordResponse> addWeeklyRecord(
            @Valid @RequestBody WeeklyRecordRequest request,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        WeeklyRecordResponse savedRecord = weeklyService.addWeeklyRecord(userId, request);
        return ResponseEntity.ok(savedRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeeklyRecord(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        weeklyService.deleteWeeklyRecord(userId, id);
        return ResponseEntity.noContent().build();
    }

}
