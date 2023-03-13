package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.entity.types.ChartType;
import com.improvement_app.workouts.entity.dto.DataToFront;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final ExerciseService exerciseService;

    @Override
    public List<DataToFront> generateStatisticChartData(String exerciseName, String chartType, String beginDate, String endDate) {
        List<Exercise> filteredExercises = getFilteredExercises(exerciseName, beginDate, endDate);

        ChartType type = ChartType.valueOf(chartType);

        List<Double> values;
        if (type == ChartType.Capacity) {
            values = getCapacity(filteredExercises);
        } else {
            values = getWeight(filteredExercises);
        }

        List<LocalDate> localDates = getLocalDates(filteredExercises);
        return scaleLists(values, localDates);
    }

    private List<Exercise> getFilteredExercises(String exerciseName, String beginDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate beginDateLD = LocalDate.parse(beginDate, formatter);
        LocalDate endDateLD = LocalDate.parse(endDate, formatter);

        List<Exercise> exercises = exerciseService.findByNameOrderByDate(exerciseName);

        return exercises.stream()
                .filter(exercise -> exercise.getDate().isAfter(beginDateLD))
                .filter(exercise -> exercise.getDate().isBefore(endDateLD))
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

    private List<DataToFront> scaleLists(List<Double> values, List<LocalDate> dates) {
        List<DataToFront> dataToChart = new ArrayList<>();
        for (int i = 0; i < dates.size(); i++) {
            dataToChart.add(new DataToFront(dates.get(i), values.get(i)));
        }

        return dataToChart;
    }

}
