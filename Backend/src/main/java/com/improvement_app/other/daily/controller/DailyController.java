package com.improvement_app.other.daily.controller;

import com.improvement_app.other.daily.entity.Daily;
import com.improvement_app.other.daily.service.DailyService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/daily")
public class DailyController {

    private final DailyService dailyService;

    @PostMapping("/")
    public ResponseEntity<Daily> addDaily(@RequestBody Daily dailyList) {
        Daily savedDaily = dailyService.addDaily(dailyList);
        return ResponseEntity.ok(savedDaily);
    }

    @GetMapping
    public ResponseEntity<Page<Daily>> getDaily(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size,
                                                @RequestParam(defaultValue = "date") String sortField,
                                                @RequestParam(defaultValue = "DESC") String direction) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));

        Page<Daily> allDailies = dailyService.getDailyList(pageable);

        return ResponseEntity.ok(allDailies);
    }

}
