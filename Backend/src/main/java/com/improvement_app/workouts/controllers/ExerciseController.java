package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.request.ExerciseRequest;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.response.ExerciseResponse;
import com.improvement_app.workouts.response.TrainingDayResponse;
import com.improvement_app.workouts.services.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Validated
@Tag(name = "Exercise API", description = "Controller to handle all operation on exercise database.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/exercises")
public class ExerciseController {

    private static final String TRAINING_TYPE_PATTERN =
            "^(A1|A2|B1|B2|A|B|C1|C2|C|D1|D2|D|E|K1|K2|K3|KARDIO|F1|F2|F)$";
    private static final String TRAINING_TYPE_MESSAGE = "Nieprawidłowy typ treningu";

    private final ExerciseService exerciseService;

    @Operation(description = "Get all exercises with provided date")
    @GetMapping(value = "/date/{exerciseDate}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getExercisesByDate(@PathVariable LocalDate exerciseDate,
                                                             @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.findByDateOrderByIndex(userId, exerciseDate)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided name")
    @GetMapping("/name/{exerciseName}")
    public ListResponse<ExerciseResponse> getExercisesByName(@PathVariable
                                                             @NotBlank(message = "Nazwa ćwiczenia nie może być pusta")
                                                             String exerciseName,
                                                             @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.findByNameReverseSorted(userId, exerciseName)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all exercises with provided training name")
    @GetMapping("/trainingName/{trainingName}")
    public ListResponse<ExerciseResponse> getExercisesByTrainingName(@PathVariable
                                                                     @NotBlank(message = "Nazwa treningu nie może być pusta")
                                                                     String trainingName,
                                                                     @AuthenticationPrincipal(expression = "id") Long userId) {

        List<ExerciseResponse> exercises = exerciseService.findByTrainingNameOrderByIndex(userId, trainingName)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get all training names")
    @GetMapping("/trainingName")
    public Page<String> getTrainingNames(@PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC)
                                         Pageable pageable,
                                         @AuthenticationPrincipal(expression = "id") Long userId) {
        return exerciseService.getAllTrainingNames(userId, pageable);
    }

    @Operation(description = "Get last training template")
    @GetMapping(value = "/trainingType/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getTrainingFromTemplate(@PathVariable
                                                                  @Pattern(regexp = TRAINING_TYPE_PATTERN, message = TRAINING_TYPE_MESSAGE)
                                                                  String trainingType,
                                                                  @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.generateTrainingFromTemplate(userId, trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Get last trainings by type")
    @GetMapping(value = "/training/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public Page<TrainingDayResponse> getLastTrainingsType(@PathVariable
                                                          @Pattern(regexp = TRAINING_TYPE_PATTERN, message = TRAINING_TYPE_MESSAGE)
                                                          String trainingType,
                                                          @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC)
                                                          Pageable pageable,
                                                          @AuthenticationPrincipal(expression = "id") Long userId) {

        return exerciseService.getLastTrainings(userId, trainingType, pageable)
                .map(TrainingDayResponse::from);
    }

    @Operation(description = "Get maximum exercises from training")
    @GetMapping(value = "/training/{trainingType}/maximum", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getMaxTrainingExercises(@PathVariable
                                                                  @Pattern(regexp = TRAINING_TYPE_PATTERN, message = TRAINING_TYPE_MESSAGE)
                                                                  String trainingType,
                                                                  @AuthenticationPrincipal(expression = "id") Long userId) {
        List<ExerciseResponse> exercises = exerciseService.getATHExercise(userId, trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(description = "Add new training")
    @PostMapping(value = "/addTraining", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<TrainingDayResponse> addTraining(@Valid @RequestBody List<ExerciseRequest> exercises,
                                                           @AuthenticationPrincipal(expression = "id") Long userId) {

        TrainingEntity training = exerciseService.addTraining(userId, exercises);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(TrainingDayResponse.from(training));
    }

}
