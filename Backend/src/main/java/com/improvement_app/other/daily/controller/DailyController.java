package com.improvement_app.other.daily.controller;

import com.improvement_app.common.web.ApiVersions;
import com.improvement_app.other.daily.request.DailyRequest;
import com.improvement_app.other.daily.response.DailyResponse;
import com.improvement_app.other.daily.service.DailyService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping(ApiVersions.V1 + "/daily")
public class DailyController {

    private final DailyService dailyService;

    @PostMapping("/")
    public ResponseEntity<DailyResponse> addDaily(
            @RequestBody DailyRequest request,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        DailyResponse savedDaily = dailyService.addDaily(userId, request);
        return ResponseEntity.ok(savedDaily);
    }

    @GetMapping
    public ResponseEntity<Page<DailyResponse>> getDaily(
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {

        Page<DailyResponse> allDailies = dailyService.getDailyList(userId, pageable);

        return ResponseEntity.ok(allDailies);
    }

}
