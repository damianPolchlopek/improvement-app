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
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
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

    public List<Exercise> getATHExercise(String trainingTypeShortcut) {
        String convertedTrainingType = TrainingTypeConverter.convert(trainingTypeShortcut);

        TrainingTemplate trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(convertedTrainingType));

        return trainingTemplate.getExercises().stream()
                .map(this::getMaximumCapacityExercise)
                .toList();
    }

    public Exercise getMaximumCapacityExercise(String exerciseName) {
        return exerciseRepository.findByNameOrderByDate(exerciseName, Sort.by(Sort.Direction.DESC, "date"))
                .stream()
                .max(Comparator.comparingDouble(exercise -> exercise.getRepAndWeightList()
                        .stream()
                        .map(RepAndWeight::getCapacity)
                        .reduce((double) 0, Double::sum)))
                .stream().findFirst().orElse(null);
    }

    public List<Exercise> generateTrainingFromTemplate(String trainingTypeShortcut) {
        String convertedTrainingType = TrainingTypeConverter.convert(trainingTypeShortcut);

        TrainingTemplate trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(convertedTrainingType));

        return trainingTemplate.getExercises().stream()
                .map(this::getLatestExercise)
                .toList();
    }

    public List<Map<String, Exercise>> getLastTrainings(String type) {
        String longerTrainingType = TrainingTypeConverter.convert(type);
        List<Exercise> exercises = exerciseRepository.findAll();

        List<String> byName = exercises.stream()
                .filter(e -> e.getType().equals(longerTrainingType))
                .map(Exercise::getTrainingName)
                .distinct()
                .toList();

        List<Exercise> byDate = exerciseRepository.findByTrainingNameIn(byName);

        return byDate.stream()
                // Sortowanie ćwiczeń według daty malejąco (LocalDate jest porównywalny)
                .sorted(Comparator.comparing(Exercise::getDate).reversed())
                // Grupowanie według dnia, następnie grupowanie według nazwy
                .collect(Collectors.groupingBy(Exercise::getDate, LinkedHashMap::new,
                        Collectors.toMap(Exercise::getName, e -> e, (e1, e2) -> e1, LinkedHashMap::new)))
                // Przekształcenie mapy do listy map
                .values().stream()
                .collect(Collectors.toList());
    }

    private Exercise getLatestExercise(String exerciseName) {
        return exerciseRepository.findFirstByNameOrderByDateDesc(exerciseName)
                .orElseGet(() -> new Exercise(exerciseName)); // Tworzenie nowego ćwiczenia, jeśli brak w historii
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
