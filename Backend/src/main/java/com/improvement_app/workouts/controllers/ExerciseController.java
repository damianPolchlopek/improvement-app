package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.exceptions.ExercisesNotFoundException;
import com.improvement_app.workouts.services.ExerciseService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.MediaType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercises")
public class ExerciseController implements Serializable {

    private final ExerciseService exerciseService;

    @ApiOperation("Get all exercises from database")
    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> getExercises() {
        List<Exercise> result = exerciseService.findAllOrderByDateDesc();
        return ListResponse.of(result);
    }

    @ApiOperation("Get all exercises with provided date")
    @GetMapping(value = "/date/{exerciseDate}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> getExercisesByDate(@PathVariable String exerciseDate) {
        List<Exercise> exercises = exerciseService.findByDateOrderByIndex(LocalDate.parse(exerciseDate));

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("date", exerciseDate);
        }

        return ListResponse.of(exercises);
    }

    @ApiOperation("Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public ListResponse<Exercise> getExercisesByName(@PathVariable String exerciseName) {
        List<Exercise> exercises = exerciseService.findByNameReverseSorted(exerciseName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("name", exerciseName);
        }

        return ListResponse.of(exercises);
    }

    @ApiOperation("Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public ListResponse<Exercise> getExercisesByTrainingName(@PathVariable String trainingName) {
        final String replacedTrainingName = trainingName.replace("_", " ");
        List<Exercise> exercises = exerciseService.findByTrainingNameOrderByIndex(replacedTrainingName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("trainingName", replacedTrainingName);
        }

        return ListResponse.of(exercises);
    }

    @ApiOperation("Get all training names")
    @GetMapping("/trainingName/")
    public ListResponse<String> getTrainingNames() {
        List<String> trainingNames = exerciseService.getAllTrainingNames()
                .stream()
                .limit(25)
                .toList();

        return ListResponse.of(trainingNames);
    }


    @ApiOperation("Get last training template")
    @GetMapping(value = "/trainingType/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> getTrainingFromTemplate(@PathVariable String trainingType) {
        List<Exercise> exercises = exerciseService.generateTrainingFromTemplate(trainingType);
        return ListResponse.of(exercises);
    }

    @ApiOperation("Add new training")
    @PostMapping(value = "/addTraining", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> addTraining(@RequestBody List<Exercise> exercises) {
        List<Exercise> addedTraining = exerciseService.addTraining(exercises);
        return ListResponse.of(addedTraining);
    }

}
