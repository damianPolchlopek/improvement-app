package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.request.ExerciseRequest;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ListResponse<ExerciseResponse> getExercisesByDate(@PathVariable String exerciseDate,
                                                             @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.findByDateOrderByIndex(userId, LocalDate.parse(exerciseDate))
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public ListResponse<ExerciseResponse> getExercisesByName(@PathVariable String exerciseName,
                                                             @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.findByNameReverseSorted(userId, exerciseName)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public ListResponse<ExerciseResponse> getExercisesByTrainingName(@PathVariable String trainingName,
                                                                     @AuthenticationPrincipal(expression = "id") Long userId) {

        final String replacedTrainingName = trainingName.replace("_", " ");
        List<ExerciseResponse> exercises = exerciseService.findByTrainingNameOrderByIndex(userId, replacedTrainingName)
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
                                         @RequestParam(defaultValue = "DESC") String direction,
                                         @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));

        return exerciseService.getAllTrainingNames(userId, pageable);
    }

    @Operation(description = "Get last training template")
    @GetMapping(value = "/trainingType/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getTrainingFromTemplate(@PathVariable String trainingType,
                                                                  @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.generateTrainingFromTemplate(userId, trainingType)
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
                                                          @RequestParam(defaultValue = "DESC") String direction,
                                                          @AuthenticationPrincipal(expression = "id") Long userId) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));

        return exerciseService.getLastTrainings(userId, trainingType, pageable)
                .map(TrainingDayResponse::from);
    }

    @Operation(description = "Get maximum exercises from training")
    @GetMapping(value = "/training/{trainingType}/maximum", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getMaxTrainingExercises(@PathVariable String trainingType,
                                                                  @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.getATHExercise(userId, trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Add new training")
    @PostMapping(value = "/addTraining", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<TrainingDayResponse> addTraining(@RequestBody List<ExerciseRequest> exercises,
                                                           @AuthenticationPrincipal(expression = "id") Long userId) {
        TrainingEntity training = exerciseService.addTraining(userId, exercises);
        return ResponseEntity.ok(TrainingDayResponse.from(training));
    }

}
