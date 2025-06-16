package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.chart.ChartType;
import com.improvement_app.workouts.entity.dto.DataToFront;
import com.improvement_app.workouts.entity2.ExerciseEntity;
import com.improvement_app.workouts.entity2.ExerciseSetEntity;
import com.improvement_app.workouts.exceptions.InvalidDateRangeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final ExerciseService exerciseService;

    public List<DataToFront> generateStatisticChartData(String exerciseName, String chartType, String beginDate, String endDate) {
        List<ExerciseEntity> filteredExercises = getFilteredExercises(exerciseName, beginDate, endDate);

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

    private List<ExerciseEntity> getFilteredExercises(String exerciseName, String beginDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate beginDateLD = LocalDate.parse(beginDate, formatter);
        LocalDate endDateLD = LocalDate.parse(endDate, formatter);

        if (beginDateLD.isAfter(endDateLD)) {
            throw new InvalidDateRangeException("Start date cannot be after end date");
        }

        if (endDateLD.isAfter(LocalDate.now().plusDays(1))) {
            throw new InvalidDateRangeException("End date cannot be in the future");
        }

        return exerciseService.findByNameOrderByDate(exerciseName, beginDateLD, endDateLD);
    }

    private List<LocalDate> getLocalDates(List<ExerciseEntity> exercises) {
        return exercises
                .stream()
                .map(exercise -> exercise.getTraining().getDate())
                .toList();
    }

    private List<Double> getCapacity(List<ExerciseEntity> exercises) {
        return exercises
                .stream()
                .map(ExerciseEntity::getExerciseSets)
                .map(repAndWeights ->
                        repAndWeights
                                .stream()
                                .map(ExerciseSetEntity::getCapacity)
                                .reduce((double) 0, Double::sum))
                .toList();
    }

    private List<Double> getWeight(List<ExerciseEntity> exercises) {
        if (exercises.isEmpty()) {
            return List.of();
        }

        int seriesNumber = exercises.get(0).getExerciseSets().size();

        return exercises
                .stream()
                .map(ExerciseEntity::getExerciseSets)
                .map(exerciseSet ->
                        exerciseSet
                                .stream()
                                .map(ExerciseSetEntity::getWeight)
                                .reduce((double) 0, Double::sum))
                .map(weight -> weight / seriesNumber)
                .toList();
    }

    private List<DataToFront> scaleLists(List<Double> values, List<LocalDate> dates) {
        return IntStream.range(0, dates.size())
                .mapToObj(i -> new DataToFront(dates.get(i), values.get(i)))
                .collect(Collectors.toList());
    }

}
