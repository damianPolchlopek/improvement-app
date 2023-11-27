package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.exceptions.ExercisesNotFoundException;
import com.improvement_app.workouts.services.ExerciseService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @ApiOperation("Get all exercises from database")
    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<Exercise>> getExercises() {
        List<Exercise> result = exerciseService.findAllOrderByDateDesc();
        return ResponseEntity.ok(result);
    }

    @ApiOperation("Get all exercises with provided date")
    @GetMapping(value = "/date/{exerciseDate}", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<Exercise>> getExercisesByDate(@PathVariable String exerciseDate) {
        return exerciseService.findByDateOrderByIndex(LocalDate.parse(exerciseDate))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ExercisesNotFoundException("date", exerciseDate));
    }

    @ApiOperation("Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public ResponseEntity<List<Exercise>> getExercisesByName(@PathVariable String exerciseName) {
        return exerciseService.findByNameReverseSorted(exerciseName)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ExercisesNotFoundException("name", exerciseName));
    }

    @ApiOperation("Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public ResponseEntity<List<Exercise>> getExercisesByTrainingName(@PathVariable String trainingName) {
        final String replacedTrainingName = trainingName.replace("_", " ");
        return exerciseService.findByTrainingNameOrderByIndex(replacedTrainingName)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ExercisesNotFoundException("trainingName", replacedTrainingName));
    }

    @ApiOperation("Get all training names")
    @GetMapping("/trainingName/")
    public ResponseEntity<List<String>> getTrainingNames() {
        List<String> trainingNames = exerciseService.getAllTrainingNames();
        return ResponseEntity.ok(trainingNames);
    }

}
