package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class TrainingServiceImpl implements TrainingService {

    private final TrainingTemplateService trainingTemplateService;
    private final ExerciseService exerciseService;

    @Override
    public List<Exercise> generateTraining(String trainingType) {
        String convertedTrainingType = convertTrainingTypeToExerciseType(trainingType);

        TrainingTemplate trainingTemplateByName = trainingTemplateService.getTrainingTemplateByName(convertedTrainingType);
        List<String> templateExercises = trainingTemplateByName.getExercises();

        List<Exercise> allExercises = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(allExercises);

        return templateExercises.stream()
                .map(exerciseName -> getLatestExercise(exerciseName, allExercises))
                .collect(Collectors.toList());
    }

    private Exercise getLatestExercise(String exerciseName, List<Exercise> exercises) {
        return exercises
                .stream()
                .filter(exercise -> exercise.getName().equals(exerciseName))
                .findFirst().orElseThrow();
    }

    private String convertTrainingTypeToExerciseType(String trainingType){

        if ("A".equals(trainingType))
            return "Siłowy#1-A";

        if ("B".equals(trainingType))
            return "Siłowy#1-B";

        if ("C".equals(trainingType))
            return "Hipertroficzny#1-C";

        if ("D".equals(trainingType))
            return "Hipertroficzny#1-D";

        return "Nie znany typ";
    }
}
