package com.improvement_app.other.daily.controller;

import com.improvement_app.common.web.ApiVersions;
import com.improvement_app.other.daily.entity.Daily;
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
    public ResponseEntity<Daily> addDaily(@RequestBody Daily dailyList) {
        Daily savedDaily = dailyService.addDaily(dailyList);
        return ResponseEntity.ok(savedDaily);
    }

    @GetMapping
    public ResponseEntity<Page<Daily>> getDaily(
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<Daily> allDailies = dailyService.getDailyList(pageable);

        return ResponseEntity.ok(allDailies);
    }

}
