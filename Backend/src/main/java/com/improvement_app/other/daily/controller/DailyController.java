package com.improvement_app.other.daily.controller;

import com.improvement_app.other.daily.entity.Daily;
import com.improvement_app.other.daily.service.DailyService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/daily")
public class DailyController {

    private final DailyService dailyService;

    @PostMapping
    public ResponseEntity<Daily> addDaily(@RequestBody Daily dailyList) {
        Daily savedDaily = dailyService.addDaily(dailyList);
        return ResponseEntity.ok(savedDaily);
    }

    @GetMapping
    public  ResponseEntity<List<Daily>> getDaily() {
        List<Daily> allDailies = dailyService.getDailyList();
        List<Daily> collect = allDailies.stream().sorted(Comparator.comparing(Daily::getDate).reversed()).collect(Collectors.toList());
        return ResponseEntity.ok(collect);
    }

}
