package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.services.ExerciseService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise/statistic/")
public class StatisticController {

    private final ExerciseService exerciseService;

//    @GetMapping("/date/name/{exerciseName}")
//    public Response getExercisesDateByName(@PathVariable String exerciseName) {
//        List<Exercise> exercises = exerciseService.findByNameReverseSorted(exerciseName);
//
//        List<LocalDate> exercisesDates = exercises
//                .stream()
//                .map(Exercise::getDate)
//                .collect(Collectors.toList());
//
//        return Response.ok(exercisesDates).build();
//    }
//
//    @GetMapping("/capacity/name/{exerciseName}")
//    public Response getExercisesCapacityByName(@PathVariable String exerciseName) {
//        List<Exercise> exercises = exerciseService.findByName(exerciseName);
//        System.out.println(exercises);
//
//        List<List<RepAndWeight>> exercisesDates = exercises
//                .stream()
//                .map(Exercise::getRepAndWeightList)
//                .collect(Collectors.toList());
//
//        //TODO: zrobic to na streamie !!!
//        List<Double> result = new ArrayList<>();
//        for (List<RepAndWeight> exerciseCapacity : exercisesDates) {
//            Double tmpValue = Double.valueOf(0);
//
//            for (RepAndWeight repAndWeight : exerciseCapacity) {
//             tmpValue += (repAndWeight.getWeight() * repAndWeight.getRepetition());
//            }
//
//            result.add(tmpValue);
//        }
//
//
//        return Response.ok(result).build();
//    }

    @GetMapping("/capacity/statistic/{exerciseName}")
    public Response getData(@PathVariable String exerciseName) {

        List<Exercise> exercises = exerciseService.findByName(exerciseName);

        List<LocalDate> exercisesDates = exercises
                .stream()
                .map(Exercise::getDate)
                .collect(Collectors.toList());

        List<List<RepAndWeight>> exercisesRepAndWeights = exercises
                .stream()
                .map(Exercise::getRepAndWeightList)
                .collect(Collectors.toList());

        List<Double> exercisesCapacity = exercisesRepAndWeights
                .stream()
                .map(repAndWeights ->
                        repAndWeights
                                .stream()
                                .map(RepAndWeight::getCapacity)
                                .reduce((double)0, Double::sum))
                .collect(Collectors.toList());



        List<DataToFront> dataToChart = new ArrayList<>();
        for (int i = 0; i < exercisesDates.size(); i++) {
            dataToChart.add(new DataToFront(exercisesDates.get(i), exercisesCapacity.get(i)));
        }

        return Response.ok(dataToChart).build();
    }

    @GetMapping("/weight/statistic/{exerciseName}")
    public Response getWeightData(@PathVariable String exerciseName) {

        List<Exercise> exercises = exerciseService.findByName(exerciseName);

        List<LocalDate> exercisesDates = exercises
                .stream()
                .map(Exercise::getDate)
                .collect(Collectors.toList());

        List<List<RepAndWeight>> exercisesRepAndWeights = exercises
                .stream()
                .map(Exercise::getRepAndWeightList)
                .collect(Collectors.toList());

        int seriesNumber = exercisesRepAndWeights.get(0).size();
        List<Double> exercisesWeight = exercisesRepAndWeights
                .stream()
                .map(repAndWeights ->
                        repAndWeights
                                .stream()
                                .map(RepAndWeight::getWeight)
                                .reduce((double)0, Double::sum))
                .map(weight -> weight/seriesNumber )
                .collect(Collectors.toList());

        List<DataToFront> dataToChart = new ArrayList<>();
        for (int i = 0; i < exercisesDates.size(); i++) {
            dataToChart.add(new DataToFront(exercisesDates.get(i), exercisesWeight.get(i)));
        }

        return Response.ok(dataToChart).build();
    }


    @Data
    public class DataToFront{
        LocalDate localDate;
        Double value;

        public DataToFront(LocalDate localDate, Double value) {
            this.localDate = localDate;
            this.value = value;
        }
    }

}
