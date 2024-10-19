package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.exceptions.TrainingTemplateNotFoundException;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.ExerciseStrategy;
import com.improvement_app.workouts.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.util.*;
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

    public List<Exercise> findByDateOrderByIndex(LocalDate date) {
        return exerciseRepository.findByDateOrderByIndex(date);
    }

    public List<Exercise> findByNameReverseSorted(String name) {
        return exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.DESC, "date"));
    }

    public List<Exercise> findByNameOrderByDate(String name) {
        return exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.ASC, "date"));
    }

    public List<Exercise> findByTrainingNameOrderByIndex(String trainingName) {
        return exerciseRepository.findByTrainingNameOrderByIndex(trainingName);
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

        TrainingTemplate trainingTemplate = trainingTemplateService.getTrainingTemplateByName(convertedTrainingType)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(convertedTrainingType));

        List<Exercise> allExercises = exerciseRepository.findAll();

        return trainingTemplate.getExercises().stream()
                .map(exerciseName -> getLatestExercise(exerciseName, allExercises))
                .toList();
    }

    private Exercise getLatestExercise(String exerciseName, List<Exercise> exercises) {
        return exercises.stream()
                .filter(exercise -> exercise.getName().equals(exerciseName))
                .max(Comparator.comparing(Exercise::getDate))
                .orElseGet(() -> new Exercise(exerciseName)); // Tworzenie nowego ćwiczenia, jeśli brak w historii
    }

    private static final Map<String, String> trainingTypeMap = Map.of(
            "A", "Siłowy#1-A",
            "B", "Siłowy#1-B",
            "C", "Hipertroficzny#1-C",
            "D", "Hipertroficzny#1-D",
            "A1", "Siłowy#1-A1",
            "B1", "Siłowy#1-B1",
            "C1", "Hipertroficzny#1-C1",
            "D1", "Hipertroficzny#1-D1",
            "E", "Basen#1-E"
    );

    private String convertTrainingTypeToExerciseType(String trainingType) {
        return trainingTypeMap.getOrDefault(trainingType, trainingType);
    }

    public List<Exercise> addTraining(List<Exercise> exercises) {
        List<Exercise> exercisesFromDb = findAllOrderByDateDesc();

        String trainingName = generateTrainingName(exercises, exercisesFromDb);
        String excelFileLocation = createTrainingExcelFile(exercises, trainingName);
        uploadTrainingToGoogleDrive(excelFileLocation, trainingName);

        List<Exercise> filledExercises = fillMissingFieldsForExercises(exercises, trainingName);
        return exerciseRepository.saveAll(filledExercises);
    }

    private String generateTrainingName(List<Exercise> exercises, List<Exercise> exercisesFromDb) {
        return DriveFilesHelper.generateFileName(exercises, exercisesFromDb.get(0));
    }

    private String createTrainingExcelFile(List<Exercise> exercises, String trainingName) {
        String excelFileLocation = filePathService.getExcelPath(trainingName);
        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);
        return excelFileLocation;
    }

    private void uploadTrainingToGoogleDrive(String excelFileLocation, String trainingName) {
        File file = new File(excelFileLocation);
        googleDriveFileService.uploadFile(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);
    }

    private List<Exercise> fillMissingFieldsForExercises(List<Exercise> exercises, String trainingName) {
        return exercises.stream().map(exercise -> {
            ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(
                    exercise.getType(), exercise.getReps(), exercise.getWeight());
            List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

            return new Exercise(
                    exercise.getType(),
                    exercise.getPlace(),
                    exercise.getName(),
                    repAndWeightList,
                    exercise.getProgress(),
                    LocalDate.now(),
                    exercise.getReps(),
                    exercise.getWeight(),
                    trainingName,
                    exercise.getIndex());
        }).collect(Collectors.toList());
    }
}
