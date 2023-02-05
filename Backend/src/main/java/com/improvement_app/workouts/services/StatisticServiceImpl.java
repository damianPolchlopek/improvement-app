package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.entity.types.ChartType;
import com.improvement_app.workouts.entity.types.DataToFront;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements StatisticService {

    @Override
    public List<Exercise> getFilteredExercises(List<Exercise> exercises, LocalDate beginDate, LocalDate endDate) {
        return exercises.stream()
                .filter(exercise -> exercise.getDate().isAfter(beginDate))
                .filter(exercise -> exercise.getDate().isBefore(endDate))
                .collect(Collectors.toList());
    }

    private List<LocalDate> getLocalDates(List<Exercise> exercises) {
        return exercises
                .stream()
                .map(Exercise::getDate)
                .collect(Collectors.toList());
    }

    private List<Double> getCapacity(List<Exercise> exercises) {
        return exercises
                .stream()
                .map(Exercise::getRepAndWeightList)
                .map(repAndWeights ->
                        repAndWeights
                                .stream()
                                .map(RepAndWeight::getCapacity)
                                .reduce((double)0, Double::sum))
                .collect(Collectors.toList());
    }

    private List<Double> getWeight(List<Exercise> exercises) {
        int seriesNumber = exercises.get(0).getRepAndWeightList().size();
        return exercises
                .stream()
                .map(Exercise::getRepAndWeightList)
                .map(repAndWeights ->
                        repAndWeights
                                .stream()
                                .map(RepAndWeight::getWeight)
                                .reduce((double)0, Double::sum))
                .map(weight -> weight/seriesNumber )
                .collect(Collectors.toList());
    }

    @Override
    public List<DataToFront> createDataToChart(List<Exercise> exercises, ChartType type) {
        List<LocalDate> localDates = getLocalDates(exercises);
        List<Double> values;
        if (type == ChartType.Capacity) {
            values = getCapacity(exercises);
        } else {
            values = getWeight(exercises);
        }

        return scaleLists(values, localDates);
    }

    private List<DataToFront> scaleLists(List<Double> values, List<LocalDate> dates) {
        List<DataToFront> dataToChart = new ArrayList<>();
        for (int i = 0; i < dates.size(); i++) {
            dataToChart.add(new DataToFront(dates.get(i), values.get(i)));
        }

        return dataToChart;
    }

}
