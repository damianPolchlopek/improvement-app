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
import java.util.List;
import java.util.stream.Collectors;

import static com.improvement_app.ApplicationVariables.EXCEL_EXTENSION;
import static com.improvement_app.ApplicationVariables.PATH_TO_EXCEL_FILES;
import static com.improvement_app.workouts.TrainingModuleVariables.DRIVE_TRAININGS_FOLDER_NAME;

@Service
@RequiredArgsConstructor
public class TrainingServiceImpl implements TrainingService {

    private final TrainingTemplateService trainingTemplateService;
    private final ExerciseService exerciseService;

    private final GoogleDriveFileService googleDriveFileService;

    @Override
    public List<Exercise> generateTrainingFromTemplate(String trainingType) {
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

    @Override
    public List<Exercise> addTraining(List<Exercise> exercises) throws IOException {
        List<Exercise> exercisesFromDb = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(exercisesFromDb);

        final String trainingName = DriveFilesHelper.generateFileName(exercises, exercisesFromDb.get(0));
        final String trainingNameExcelFile = trainingName + EXCEL_EXTENSION;

        final String excelFileLocation = PATH_TO_EXCEL_FILES + trainingNameExcelFile;
        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);

        final File file = new File(excelFileLocation);
        googleDriveFileService.uploadFileInFolder(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);

        List<Exercise> newExercises = ExercisesHelper.fillMissingFieldForExercise(exercises, trainingName);
        List<Exercise> savedExercises = exerciseService.saveAll(newExercises);

        return savedExercises;
    }
}
