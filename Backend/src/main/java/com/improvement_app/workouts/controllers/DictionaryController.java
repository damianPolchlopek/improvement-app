package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.entity.exercisesfields.Place;
import com.improvement_app.workouts.entity.exercisesfields.Progress;
import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.services.data.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Tag(name = "Dictionary API", description = "Example API operations")
@RestController
@RequiredArgsConstructor
@RequestMapping("exercises/dictionary")
public class DictionaryController {

    private final ExerciseNameService exerciseNameService;
    private final ExercisePlaceService exercisePlaceService;
    private final ExerciseProgressService exerciseProgressService;
    private final ExerciseTypeService exerciseTypeService;
    private final TrainingTemplateService trainingTemplateService;

    @GetMapping("/name")
    public ListResponse<Name> getExerciseNames() {
        List<Name> exerciseNames = exerciseNameService.getExerciseNames();
        return ListResponse.of(exerciseNames);
    }

    @GetMapping("/place")
    public ListResponse<Place> getExercisePlaces() {
        List<Place> exercisePlaces = exercisePlaceService.getExercisePlaces();
        return ListResponse.of(exercisePlaces);
    }

    @GetMapping("/progress")
    public ListResponse<Progress> getExerciseProgresses() {
        List<Progress> exerciseProgresses = exerciseProgressService.getExerciseProgress();
        return ListResponse.of(exerciseProgresses);
    }

    @GetMapping("/type")
    public ListResponse<Type> getExerciseTypes() {
        List<Type> exerciseTypes = exerciseTypeService.getExerciseTypes();
        return ListResponse.of(exerciseTypes);
    }

    @Operation(description = "Get training template")
    @GetMapping(value = "/training/{template}", produces = MediaType.APPLICATION_JSON)
    public TrainingTemplate getTrainingTemplate(@PathVariable String template) {
        return trainingTemplateService.getTrainingTemplate(template)
                .orElseThrow(() -> new RuntimeException("Training template not found"));
    }
}
