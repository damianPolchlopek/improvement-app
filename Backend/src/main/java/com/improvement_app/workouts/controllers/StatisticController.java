package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.enums.ChartType;
import com.improvement_app.workouts.response.ChartPoint;
import com.improvement_app.workouts.services.StatisticService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.ws.rs.core.MediaType;
import java.util.List;


@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/exercises/")
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping(value = "{exerciseName}/statistic", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<ChartPoint>> getTrainingStatisticData(
                                            @PathVariable
                                            @NotBlank(message = "Exercise name is required")
                                            @Size(min = 2, max = 100)
                                            String exerciseName,

                                            @RequestParam(defaultValue = "Capacity")
                                            ChartType chartType,

                                            @RequestParam
                                            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                            @NotNull
                                            String beginDate,

                                            @RequestParam
                                            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                            @NotNull
                                            String endDate,

                                            @AuthenticationPrincipal(expression = "id") Long userId)
    {

        List<ChartPoint> statistics
                = statisticService.generateStatisticChartData(userId, exerciseName, chartType, beginDate, endDate);

        return statistics.isEmpty()
            ? ResponseEntity.noContent().build()
            : ResponseEntity.ok(statistics);
    }

}
