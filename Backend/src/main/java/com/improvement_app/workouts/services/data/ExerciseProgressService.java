package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Progress;

import java.util.List;

public interface ExerciseProgressService {

    List<Progress> getExerciseProgress();

    List<Progress> saveAllExerciseProgresses(List<Progress> progressList);

    void deleteAllExerciseProgresses();

}
