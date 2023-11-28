package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.exceptions.TrainingTemplateNotFoundException;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.improvement_app.workouts.TrainingModuleVariables.DRIVE_TRAININGS_FOLDER_NAME;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final TrainingTemplateService trainingTemplateService;
    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;

    public Optional<List<Exercise>> findByDateOrderByIndex(LocalDate date) {
        List<Exercise> exercises = exerciseRepository.findByDateOrderByIndex(date);
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public Optional<List<Exercise>> findByNameReverseSorted(String name) {
        List<Exercise> exercises = exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.DESC, "date"));
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public Optional<List<Exercise>> findByNameOrderByDate(String name) {
        List<Exercise> exercises = exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.ASC, "date"));
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public Optional<List<Exercise>> findByTrainingNameOrderByIndex(String trainingName) {
        List<Exercise> exercises = exerciseRepository.findByTrainingNameOrderByIndex(trainingName);
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public List<Exercise> saveAll(List<Exercise> exercises) {
        return exerciseRepository.saveAll(exercises);
    }

    public List<Exercise> findAllOrderByDateDesc() {
        return exerciseRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }

    public List<String> getAllTrainingNames() {
        List<Exercise> exercises = exerciseRepository.findAll();

        return exercises.stream()
                .map(Exercise::getTrainingName)
                .distinct()
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    public void deleteAllExercises() {
        exerciseRepository.deleteAll();
    }








    public List<Exercise> generateTrainingFromTemplate(String trainingType) {
        String convertedTrainingType = convertTrainingTypeToExerciseType(trainingType);

        TrainingTemplate trainingTemplateByName = trainingTemplateService.getTrainingTemplateByName(convertedTrainingType)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(convertedTrainingType));
        List<String> templateExercises = trainingTemplateByName.getExercises();

        List<Exercise> allExercises = exerciseRepository.findAll();

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

        return trainingType;
    }

    public List<Exercise> addTraining(List<Exercise> exercises) {
        List<Exercise> exercisesFromDb = findAllOrderByDateDesc();

        final String trainingName = DriveFilesHelper.generateFileName(exercises, exercisesFromDb.get(0));

        final String excelFileLocation = filePathService.getDownloadedFile(trainingName).getPath();
        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);

        final File file = new File(excelFileLocation);
        googleDriveFileService.uploadFile(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);

        List<Exercise> newExercises = ExercisesHelper.fillMissingFieldForExercise(exercises, trainingName);
        return exerciseRepository.saveAll(newExercises);
    }


}
