package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.types.ChartType;
import com.improvement_app.workouts.entity.dto.DataToFront;

import java.time.LocalDate;
import java.util.List;

public interface StatisticService {

    List<Exercise> getFilteredExercises(List<Exercise> exercises, LocalDate beginDate, LocalDate endDate);
    List<DataToFront> createDataToChart(List<Exercise> exercises, ChartType type);
}
