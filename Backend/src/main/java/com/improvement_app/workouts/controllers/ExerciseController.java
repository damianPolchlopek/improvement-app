package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.controllers.request.ExerciseRequest;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.response.ExerciseResponse;
import com.improvement_app.workouts.response.TrainingDayResponse;
import com.improvement_app.workouts.services.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Tag(name = "Exercise API", description = "Controller to handle all operation on exercise database.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/exercises")
public class ExerciseController implements Serializable {

    private final ExerciseService exerciseService;

    @Operation(description = "Get all exercises with provided date")
    @GetMapping(value = "/date/{exerciseDate}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getExercisesByDate(@PathVariable String exerciseDate) {
        List<ExerciseResponse> exercises = exerciseService.findByDateOrderByIndex(LocalDate.parse(exerciseDate))
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public ListResponse<ExerciseResponse> getExercisesByName(@PathVariable String exerciseName) {
        List<ExerciseResponse> exercises = exerciseService.findByNameReverseSorted(exerciseName)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public ListResponse<ExerciseResponse> getExercisesByTrainingName(@PathVariable String trainingName) {
        final String replacedTrainingName = trainingName.replace("_", " ");
        List<ExerciseResponse> exercises = exerciseService.findByTrainingNameOrderByIndex(replacedTrainingName)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

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
    public ListResponse<ExerciseResponse> getTrainingFromTemplate(@PathVariable String trainingType) {
        List<ExerciseResponse> exercises = exerciseService.generateTrainingFromTemplate(trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get last trainings by type")
    @GetMapping(value = "/training/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public Page<TrainingDayResponse> getLastTrainingsType(@PathVariable String trainingType,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          @RequestParam(defaultValue = "date") String sortField,
                                                          @RequestParam(defaultValue = "DESC") String direction) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));

        return exerciseService.getLastTrainings(trainingType, pageable)
                .map(TrainingDayResponse::from);
    }

    @Operation(description = "Get maximum exercises from training")
    @GetMapping(value = "/training/{trainingType}/maximum", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getMaxTrainingExercises(@PathVariable String trainingType) {
        List<ExerciseResponse> exercises = exerciseService.getATHExercise(trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Add new training")
    @PostMapping(value = "/addTraining", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<TrainingDayResponse> addTraining(@RequestBody List<ExerciseRequest> exercises) {
        TrainingEntity training = exerciseService.addTraining(exercises);
        return ResponseEntity.ok(TrainingDayResponse.from(training));
    }

}
