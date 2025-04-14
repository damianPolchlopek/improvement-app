package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.util.Page;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.exceptions.ExercisesNotFoundException;
import com.improvement_app.workouts.services.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import jakarta.ws.rs.core.MediaType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;

@Tag(name="Exercise API", description = "Controller to handle all operation on exercise database.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/exercises")
public class ExerciseController implements Serializable {

    private final ExerciseService exerciseService;

    @Operation(description = "Get all exercises with provided date")
    @GetMapping(value = "/date/{exerciseDate}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> getExercisesByDate(@PathVariable String exerciseDate) {
        List<Exercise> exercises = exerciseService.findByDateOrderByIndex(LocalDate.parse(exerciseDate));

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("date", exerciseDate);
        }

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public ListResponse<Exercise> getExercisesByName(@PathVariable String exerciseName) {
        List<Exercise> exercises = exerciseService.findByNameReverseSorted(exerciseName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("name", exerciseName);
        }

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public ListResponse<Exercise> getExercisesByTrainingName(@PathVariable String trainingName) {
        final String replacedTrainingName = trainingName.replace("_", " ");
        List<Exercise> exercises = exerciseService.findByTrainingNameOrderByIndex(replacedTrainingName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("trainingName", replacedTrainingName);
        }

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all training names")
    @GetMapping("/trainingName")
    public Page<String> getTrainingNames(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam(defaultValue = "date") String sortField,
                                         @RequestParam(defaultValue = "DESC") String direction) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));

        return exerciseService.getAllTrainingNames(pageable);
    }

    @Operation(description = "Get last training template")
    @GetMapping(value = "/trainingType/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> getTrainingFromTemplate(@PathVariable String trainingType) {
        List<Exercise> exercises = exerciseService.generateTrainingFromTemplate(trainingType);
        return ListResponse.of(exercises);
    }

    @Operation(description = "Get last trainings by type")
    @GetMapping(value = "/training/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public Page<LinkedHashMap<String, Exercise>> getLastTrainingsType(@PathVariable String trainingType,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size,
                                                                      @RequestParam(defaultValue = "date") String sortField,
                                                                      @RequestParam(defaultValue = "DESC") String direction) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));

        return exerciseService.getLastTrainings(trainingType, pageable);
    }

    @Operation(description = "Get maximum exercises from training")
    @GetMapping(value = "/training/{trainingType}/maximum", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> getMaxTrainingExercises(@PathVariable String trainingType) {
        List<Exercise> exercises = exerciseService.getATHExercise(trainingType);
        return ListResponse.of(exercises);
    }

    @Operation(description = "Add new training")
    @PostMapping(value = "/addTraining", produces = MediaType.APPLICATION_JSON)
    public ListResponse<Exercise> addTraining(@RequestBody List<Exercise> exercises) {
        List<Exercise> addedTraining = exerciseService.addTraining(exercises);
        return ListResponse.of(addedTraining);
    }

}
