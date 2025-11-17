package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.enums.ChartType;
import com.improvement_app.workouts.response.ChartPoint;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.exceptions.InvalidDateRangeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticService {

    private final ExerciseService exerciseService;

    public List<ChartPoint> generateStatisticChartData(Long userId, String exerciseName, String chartType, String beginDate, String endDate) {
        List<ExerciseEntity> filteredExercises = getFilteredExercises(userId, exerciseName, beginDate, endDate);

        ChartType type = ChartType.valueOf(chartType);

        List<Double> values;
        if (type == ChartType.Capacity) {
            values = getCapacity(filteredExercises);
        } else if (type == ChartType.Weight){
            values = getWeight(filteredExercises);
        } else {
            throw new IllegalArgumentException("User selected incorrect chart type: " + type);
        }

        List<Instant> localDates = getLocalDates(filteredExercises);
        return scaleLists(values, localDates);
    }

    private List<ExerciseEntity> getFilteredExercises(Long userId, String exerciseName, String beginDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate beginDateLD = LocalDate.parse(beginDate, formatter);
        LocalDate endDateLD = LocalDate.parse(endDate, formatter);

        if (beginDateLD.isAfter(endDateLD)) {
            throw new InvalidDateRangeException("Start date cannot be after end date");
        }

        if (endDateLD.isAfter(LocalDate.now().plusDays(1))) {
            throw new InvalidDateRangeException("End date cannot be in the future");
        }

        return exerciseService.findByNameOrderByDate(userId, exerciseName, beginDateLD, endDateLD);
    }

    private List<Instant> getLocalDates(List<ExerciseEntity> exercises) {
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
            log.warn("No data to send to chart");
            return List.of();
        }

        List<Double> result = new ArrayList<>();
        for (ExerciseEntity exerciseEntity : exercises) {
            int seriesNumber = exerciseEntity.getExerciseSets().size();

            Double reduce = exerciseEntity.getExerciseSets().stream()
                    .map(ExerciseSetEntity::getWeight)
                    .reduce((double) 0, Double::sum);

            Double calculationResult = reduce / seriesNumber;
            result.add(calculationResult);
        }

        return result;
    }

    private List<ChartPoint> scaleLists(List<Double> values, List<Instant> dates) {
        return IntStream.range(0, dates.size())
                .mapToObj(i -> new ChartPoint(dates.get(i), values.get(i)))
                .collect(Collectors.toList());
    }

}
