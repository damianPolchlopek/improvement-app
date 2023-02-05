package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.types.ChartType;
import com.improvement_app.workouts.entity.types.DataToFront;
import com.improvement_app.workouts.services.ExerciseService;
import com.improvement_app.workouts.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise/statistic/")
public class StatisticController {

    private final ExerciseService exerciseService;

    private final StatisticService statisticService;

    @GetMapping("/{exerciseName}/{chartType}/{beginDate}/{endDate}")
    public Response getTrainingStatisticData(@PathVariable String exerciseName,
                                             @PathVariable String chartType,
                                             @PathVariable String beginDate,
                                             @PathVariable String endDate) {

        ChartType type = ChartType.valueOf(chartType);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate beginDateLD = LocalDate.parse(beginDate, formatter);
        LocalDate endDateLD = LocalDate.parse(endDate, formatter);

        List<Exercise> exercises = exerciseService.findByName(exerciseName);
        List<Exercise> filteredExercises = statisticService.getFilteredExercises(exercises, beginDateLD, endDateLD);

        List<DataToFront> dataToChart = statisticService.createDataToChart(filteredExercises, type);

        return Response.ok(dataToChart).build();
    }

}
