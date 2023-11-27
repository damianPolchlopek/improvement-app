package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;

import static com.improvement_app.ApplicationVariables.EXCEL_EXTENSION;
import static com.improvement_app.ApplicationVariables.PATH_TO_EXCEL_FILES;
import static com.improvement_app.workouts.TrainingModuleVariables.DRIVE_TRAININGS_FOLDER_NAME;

@Service
@RequiredArgsConstructor
public class TrainingService {

    private final TrainingTemplateService trainingTemplateService;
    private final ExerciseService exerciseService;

    private final GoogleDriveFileService googleDriveFileService;

    public List<Exercise> generateTrainingFromTemplate(String trainingType) {
        String convertedTrainingType = convertTrainingTypeToExerciseType(trainingType);

        TrainingTemplate trainingTemplateByName = trainingTemplateService.getTrainingTemplateByName(convertedTrainingType);
        List<String> templateExercises = trainingTemplateByName.getExercises();

        List<Exercise> allExercises = exerciseService.findAll();

        return templateExercises.stream()
                .map(exerciseName -> getLatestExercise(exerciseName, allExercises))
                .toList();
    }

    private Exercise getLatestExercise(String exerciseName, List<Exercise> exercises) {
        return exercises
                .stream()
                .filter(exercise -> exercise.getName().equals(exerciseName))
                .max(Comparator.comparing(Exercise::getDate))
                .orElseThrow();
    }

    private String convertTrainingTypeToExerciseType(String trainingType) {

        if ("A".equals(trainingType))
            return "Siłowy#1-A";

        if ("B".equals(trainingType))
            return "Siłowy#1-B";

        if ("C".equals(trainingType))
            return "Hipertroficzny#1-C";

        if ("D".equals(trainingType))
            return "Hipertroficzny#1-D";

        if ("E".equals(trainingType))
            return "Basen#1-E";

        return "Nie znany typ";
    }

    public List<Exercise> addTraining(List<Exercise> exercises) throws IOException {
        List<Exercise> exercisesFromDb = exerciseService.findAllOrderByDateDesc();

        final String trainingName = DriveFilesHelper.generateFileName(exercises, exercisesFromDb.get(0));

        final String excelFileLocation = PATH_TO_EXCEL_FILES + trainingName + EXCEL_EXTENSION;
        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);

        final File file = new File(excelFileLocation);
        googleDriveFileService.uploadFileInFolder(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);

        List<Exercise> newExercises = ExercisesHelper.fillMissingFieldForExercise(exercises, trainingName);
        return exerciseService.saveAll(newExercises);
    }
}
