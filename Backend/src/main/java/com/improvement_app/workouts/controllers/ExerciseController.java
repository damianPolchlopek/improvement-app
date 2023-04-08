package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.services.ExerciseService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @ApiOperation("Get all exercises from database")
    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON)
    public Response getExercises() {
        List<Exercise> result = exerciseService.findAllOrderByDateDesc();
        return Response.ok(result).build();
    }

    @ApiOperation("Get all exercises with provided date")
    @GetMapping(value = "/date/{exerciseDate}", produces = MediaType.APPLICATION_JSON)
    public Response getExercisesByDate(@PathVariable String exerciseDate) {
        List<Exercise> result = exerciseService.findByDateOrderByIndex(LocalDate.parse(exerciseDate));
        return Response.ok(result).build();
    }

    @ApiOperation("Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public Response getExercisesByName(@PathVariable String exerciseName) {
        List<Exercise> result = exerciseService.findByNameReverseSorted(exerciseName);
        return Response.ok(result).build();
    }

    @ApiOperation("Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public Response getExercisesByTrainingName(@PathVariable String trainingName) {
        trainingName = trainingName.replace("_", " ");
        List<Exercise> result = exerciseService.findByTrainingNameOrderByIndex(trainingName);
        return Response.ok(result).build();
    }

    @ApiOperation("Delete exercise with provided ID")
    @DeleteMapping("/{exerciseId}")
    public Response deleteExercise(@PathVariable String exerciseId) {
        exerciseService.deleteById(exerciseId);
        return Response.ok().build();
    }

    @ApiOperation("Get all training names")
    @GetMapping("/trainingName/")
    public Response getTrainingNames() {
        List<String> trainingNames = exerciseService.getAllTrainingNames();
        return Response.ok(trainingNames).build();
    }

}
