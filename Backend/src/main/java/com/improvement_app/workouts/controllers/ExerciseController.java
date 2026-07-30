package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.dto.ExerciseSearchCriteria;
import com.improvement_app.workouts.request.ExerciseRequest;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.response.ExerciseResponse;
import com.improvement_app.workouts.response.TrainingDayResponse;
import com.improvement_app.workouts.services.ExerciseService;
import com.improvement_app.workouts.validation.ValidTrainingType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

    private final ExerciseService exerciseService;

    @Operation(
            summary = "Pobierz ćwiczenia po jednym z kryteriów",
            description = "Podaj dokładnie jeden z parametrów: date, name lub trainingName"
    )
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> searchExercises(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String trainingName,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {

        List<ExerciseResponse> result = exerciseService
                .findExercises(userId, new ExerciseSearchCriteria(date, name, trainingName))
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(result);
    }

    @Operation(summary = "Pobierz nazwy wszystkich treningów", description = "Zwraca stronicowaną listę nazw treningów")
    @GetMapping("/trainingName")
    public Page<String> getTrainingNames(@PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC)
                                         Pageable pageable,
                                         @AuthenticationPrincipal(expression = "id") Long userId) {

        return exerciseService.getAllTrainingNames(userId, pageable);
    }

    @Operation(summary = "Pobierz szablon ostatniego treningu", description = "Zwraca szablon treningu z ostatnimi wykonaniami ćwiczeń")
    @GetMapping(value = "/trainingType/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getTrainingFromTemplate(@PathVariable
                                                                  @ValidTrainingType String trainingType,
                                                                  @AuthenticationPrincipal(expression = "id") Long userId) {

        List<ExerciseResponse> exercises = exerciseService.generateTrainingFromTemplate(userId, trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(summary = "Pobierz ostatnie treningi danego typu", description = "Zwraca stronicowaną listę ostatnich treningów danego typu")
    @GetMapping(value = "/training/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public Page<TrainingDayResponse> getLastTrainingsType(@PathVariable
                                                          @ValidTrainingType String trainingType,
                                                          @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC)
                                                          Pageable pageable,
                                                          @AuthenticationPrincipal(expression = "id") Long userId) {

        return exerciseService.getLastTrainings(userId, trainingType, pageable)
                .map(TrainingDayResponse::from);
    }

    @Operation(summary = "Pobierz rekordowe ćwiczenia z treningu", description = "Zwraca ćwiczenia o maksymalnej wykonanej pracy (ATH) dla danego typu treningu")
    @GetMapping(value = "/training/{trainingType}/maximum", produces = MediaType.APPLICATION_JSON)
    public ListResponse<ExerciseResponse> getMaxTrainingExercises(@PathVariable
                                                                  @ValidTrainingType String trainingType,
                                                                  @AuthenticationPrincipal(expression = "id") Long userId) {

        List<ExerciseResponse> exercises = exerciseService.getATHExercise(userId, trainingType)
                .stream()
                .map(ExerciseResponse::new)
                .toList();

        return ListResponse.of(exercises);
    }

    @Operation(summary = "Dodaj nowy trening", description = "Zapisuje trening w bazie i przesyła kopię na Google Drive")
    @PostMapping(value = "/addTraining", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<TrainingDayResponse> addTraining(@Valid @RequestBody List<ExerciseRequest> exercises,
                                                           @AuthenticationPrincipal(expression = "id") Long userId) {

        TrainingEntity training = exerciseService.addTraining(userId, exercises);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(TrainingDayResponse.from(training));
    }

}
