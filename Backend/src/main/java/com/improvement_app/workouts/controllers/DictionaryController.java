package com.improvement_app.workouts.controllers;

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
    public ResponseEntity<List<Name>> getExerciseNames() {
        List<Name> exerciseNames = exerciseNameService.getExerciseNames();
        return ResponseEntity.ok(exerciseNames);
    }

    @GetMapping("/place")
    public ResponseEntity<List<Place>> getExercisePlaces() {
        List<Place> exercisePlaces = exercisePlaceService.getExercisePlaces();
        return ResponseEntity.ok(exercisePlaces);
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Progress>> getExerciseProgresses() {
        List<Progress> exerciseProgresses = exerciseProgressService.getExerciseProgress();
        return ResponseEntity.ok(exerciseProgresses);
    }

    @GetMapping("/type")
    public ResponseEntity<List<Type>> getExerciseTypes() {
        List<Type> exerciseTypes = exerciseTypeService.getExerciseTypes();
        return ResponseEntity.ok(exerciseTypes);
    }
}
