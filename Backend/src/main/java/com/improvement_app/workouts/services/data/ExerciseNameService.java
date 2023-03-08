package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Name;

import java.util.List;

public interface ExerciseNameService {
    List<Name> getExerciseNames();

    List<Name> saveAllExerciseNames(List<Name> nameList);

    void deleteAllExerciseNames();
}
