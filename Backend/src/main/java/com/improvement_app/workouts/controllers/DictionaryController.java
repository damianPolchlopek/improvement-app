package com.improvement_app.workouts.controllers;

import com.improvement_app.common.web.ApiVersions;
import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.response.ExerciseMetadataResponse;
import com.improvement_app.workouts.services.data.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Dictionary API", description = "Example API operations")
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiVersions.V1 + "/exercises/dictionary")
public class DictionaryController {

    private final ExerciseNameService exerciseNameService;
    private final ExercisePlaceService exercisePlaceService;
    private final ExerciseProgressService exerciseProgressService;
    private final ExerciseTypeService exerciseTypeService;

    @GetMapping("/name")
    public ListResponse<ExerciseMetadataResponse> getExerciseNames() {
        List<ExerciseMetadataResponse> exerciseNames = exerciseNameService.getExerciseNames();
        return ListResponse.of(exerciseNames);
    }

    @GetMapping("/place")
    public ListResponse<ExerciseMetadataResponse> getExercisePlaces() {
        List<ExerciseMetadataResponse> exercisePlaces = exercisePlaceService.getExercisePlaces();
        return ListResponse.of(exercisePlaces);
    }

    @GetMapping("/progress")
    public ListResponse<ExerciseMetadataResponse> getExerciseProgresses() {
        List<ExerciseMetadataResponse> exerciseProgresses = exerciseProgressService.getExerciseProgresses();
        return ListResponse.of(exerciseProgresses);
    }

    @GetMapping("/type")
    public ListResponse<ExerciseMetadataResponse> getExerciseTypes() {
        List<ExerciseMetadataResponse> exerciseTypes = exerciseTypeService.getExerciseTypes();
        return ListResponse.of(exerciseTypes);
    }
}
