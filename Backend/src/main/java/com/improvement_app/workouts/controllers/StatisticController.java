package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.dto.DataToFront;
import com.improvement_app.workouts.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise/statistic/")
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping(value = "{exerciseName}/{chartType}/{beginDate}/{endDate}", produces = MediaType.APPLICATION_JSON)
    public Response getTrainingStatisticData(@PathVariable String exerciseName,
                                             @PathVariable String chartType,
                                             @PathVariable String beginDate,
                                             @PathVariable String endDate) {

        List<DataToFront> dataToChart
                = statisticService.generateStatisticChartData(exerciseName, chartType, beginDate, endDate);

        return Response.ok(dataToChart).build();
    }

}
