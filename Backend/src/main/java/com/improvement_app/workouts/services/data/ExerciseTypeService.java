package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Type;

import java.util.List;

public interface ExerciseTypeService {
    List<Type> getExerciseTypes();

    List<Type> saveAllExerciseTypes(List<Type> typeList);

    void deleteAllExerciseTypes();
}
