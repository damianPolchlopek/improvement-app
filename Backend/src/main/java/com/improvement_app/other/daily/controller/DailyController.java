package com.improvement_app.other.daily.controller;

import com.improvement_app.other.daily.entity.Daily;
import com.improvement_app.other.daily.service.DailyService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.ws.rs.core.Response;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/daily")
public class DailyController {

    private final DailyService dailyService;

    @PostMapping
    public Response addDaily(@RequestBody Daily dailyList) {
        Daily savedDaily = dailyService.addDaily(dailyList);
        return Response.ok(savedDaily).build();
    }

    @GetMapping
    public Response getDaily() {
        List<Daily> allDailies = dailyService.getDailyList();
        List<Daily> collect = allDailies.stream().sorted(Comparator.comparing(Daily::getDate).reversed()).collect(Collectors.toList());
        return Response.ok(collect).build();
    }

}
