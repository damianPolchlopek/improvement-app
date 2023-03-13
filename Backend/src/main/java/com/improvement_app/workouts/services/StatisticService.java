package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.dto.DataToFront;

import java.util.List;

public interface StatisticService {
    List<DataToFront> generateStatisticChartData(String exerciseName, String chartType, String beginDate, String endDate);
}
