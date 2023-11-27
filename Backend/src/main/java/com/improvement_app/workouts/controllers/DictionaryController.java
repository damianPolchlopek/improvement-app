package com.improvement_app.workouts.controllers;

import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.entity.exercisesfields.Place;
import com.improvement_app.workouts.entity.exercisesfields.Progress;
import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.services.data.ExerciseNameService;
import com.improvement_app.workouts.services.data.ExercisePlaceService;
import com.improvement_app.workouts.services.data.ExerciseProgressService;
import com.improvement_app.workouts.services.data.ExerciseTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("exercises/dictionary")
public class DictionaryController {

    private final ExerciseNameService exerciseNameService;
    private final ExercisePlaceService exercisePlaceService;
    private final ExerciseProgressService exerciseProgressService;
    private final ExerciseTypeService exerciseTypeService;

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
}
