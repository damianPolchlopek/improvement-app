package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.util.Page;
import com.improvement_app.util.PaginationHelper;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.entity2.ExerciseEntity;
import com.improvement_app.workouts.entity2.ExerciseSetEntity;
import com.improvement_app.workouts.entity2.TrainingEntity;
import com.improvement_app.workouts.entity2.TrainingTemplateEntity;
import com.improvement_app.workouts.entity2.enums.ExerciseName;
import com.improvement_app.workouts.exceptions.TrainingTemplateNotFoundException;
import com.improvement_app.workouts.repository2.ExerciseEntityRepository;
import com.improvement_app.workouts.repository2.TrainingEntityRepository;
import com.improvement_app.workouts.response.ExerciseResponse;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseEntityRepository exerciseRepository;
    private final TrainingEntityRepository trainingRepository;

    private final TrainingTemplateService trainingTemplateService;
    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;


    public List<ExerciseEntity> findByDateOrderByIndex(LocalDate date) {
        return exerciseRepository.findByTraining_Date(date);
    }

//    public List<ExerciseEntity> findByNameReverseSorted(String name) {
//        return exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.DESC, "date"));
//    }

    public List<ExerciseEntity> findByNameOrderByDate(String name, LocalDate beginDateLD, LocalDate endDateLD) {
        ExerciseName exerciseName = ExerciseName.fromValue(name);

        return exerciseRepository.findByNameAndTraining_DateBetweenOrderByTraining_Date(
                exerciseName,
                beginDateLD,
                endDateLD
        );
    }

//    public List<ExerciseEntity> findByTrainingNameOrderByIndex(String trainingName) {
//        return exerciseRepository.findByTrainingNameOrderByIndex(trainingName);
//    }

    public Page<String> getAllTrainingNames(Pageable page) {
        List<String> trainingNames = getAllTrainingNames();
        return PaginationHelper.getPage(trainingNames, page.getPageNumber() + 1, page.getPageSize());
    }

    private List<String> getAllTrainingNames() {
        List<TrainingEntity> exercises = trainingRepository.findAll();

        return exercises.stream()
                .map(TrainingEntity::getName)
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }
//
//    public void deleteAllExercises() {
//        exerciseRepository.deleteAll();
//    }

    public List<ExerciseResponse> getATHExercise(String trainingTypeShortcut) {
        String convertedTrainingType = TrainingTypeConverter.convert(trainingTypeShortcut);

        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(convertedTrainingType));

        return trainingTemplate.getExercises().stream()
                .map(exercise -> getMaximumCapacityExercise(exercise.getName()))
                .flatMap(Optional::stream)
                .map(ExerciseResponse::new)
                .toList();
    }

    private Optional<ExerciseEntity> getMaximumCapacityExercise(String exerciseName) {
        final ExerciseName name = ExerciseName.fromValue(exerciseName);

        List<ExerciseEntity> exercises = exerciseRepository.findByNameOrderByTraining_DateDesc(name);

        if (exercises.isEmpty()) {
            return Optional.empty();
        }

        return exercises.stream()
                .max(Comparator.comparingDouble(exercise -> exercise.getExerciseSets()
                        .stream()
                        .map(ExerciseSetEntity::getCapacity)
                        .reduce(0.0, Double::sum)));
    }

//    public List<Exercise> generateTrainingFromTemplate(String trainingTypeShortcut) {
//        String convertedTrainingType = TrainingTypeConverter.convert(trainingTypeShortcut);
//
//        TrainingTemplate trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut)
//                .orElseThrow(() -> new TrainingTemplateNotFoundException(convertedTrainingType));
//
//        return trainingTemplate.getExercises().stream()
//                .map(this::getLatestExercise)
//                .toList();
//    }
//
//    public Page<LinkedHashMap<String, Exercise>> getLastTrainings(String type, Pageable page) {
//        final String longerTrainingType = TrainingTypeConverter.convert(type);
//        List<Exercise> exercises = exerciseRepository.findAll();
//
//        List<String> byName = exercises.stream()
//                .filter(e -> e.getType().equals(longerTrainingType))
//                .map(Exercise::getTrainingName)
//                .distinct()
//                .toList();
//
//        List<Exercise> byDate = exerciseRepository.findByTrainingNameIn(byName);
//
//        List<LinkedHashMap<String, Exercise>> collect = byDate.stream()
//                // Sortowanie ćwiczeń według daty malejąco (LocalDate jest porównywalny)
//                .sorted(Comparator.comparing(Exercise::getDate).reversed())
//                // Grupowanie według dnia, następnie grupowanie według nazwy
//                .collect(Collectors.groupingBy(Exercise::getDate, LinkedHashMap::new,
//                        Collectors.toMap(Exercise::getName, e -> e, (e1, e2) -> e1, LinkedHashMap::new)))
//                // Przekształcenie mapy do listy map
//                .values().stream()
//                .collect(Collectors.toList());
//
//        return PaginationHelper.getPage(collect, page.getPageNumber() + 1, page.getPageSize());
//    }
//
//    private Exercise getLatestExercise(String exerciseName) {
//        return exerciseRepository.findFirstByNameOrderByDateDesc(exerciseName)
//                .orElseGet(() -> new Exercise(exerciseName)); // Tworzenie nowego ćwiczenia, jeśli brak w historii
//    }
//
//    public List<Exercise> addTraining(List<Exercise> exercises) {
//        Exercise latestExercise = findLatestExercise();
//
//        String trainingName = DriveFilesHelper.generateFileName(exercises, latestExercise);
//        String excelFileLocation = createTrainingExcelFile(exercises, trainingName);
//        uploadTrainingToGoogleDrive(excelFileLocation, trainingName);
////todo: do sprawdzenia
////        List<Exercise> filledExercises = fillMissingFieldsForExercises(exercises, trainingName);
//        return exerciseRepository.saveAll(exercises);
//    }
//
//    public Exercise findLatestExercise() {
//        return exerciseRepository.findTopByOrderByDateDesc();
//    }
//
//    private String createTrainingExcelFile(List<Exercise> exercises, String trainingName) {
//        String excelFileLocation = filePathService.getExcelPath(trainingName);
//        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);
//        return excelFileLocation;
//    }
//
//    private void uploadTrainingToGoogleDrive(String excelFileLocation, String trainingName) {
//        File file = new File(excelFileLocation);
//        googleDriveFileService.uploadFile(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);
//    }
//
//    private List<Exercise> fillMissingFieldsForExercises(List<Exercise> exercises, String trainingName) {
//        return exercises.stream().map(exercise -> {
//            ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(
//                    exercise.getType(), exercise.getReps(), exercise.getWeight());
//            List<ExerciseSetEntity> repAndWeightList = exerciseStrategy.parseExercise();
//
//            return new Exercise(
//                    exercise.getType(),
//                    exercise.getPlace(),
//                    exercise.getName(),
//                    repAndWeightList,
//                    exercise.getProgress(),
//                    LocalDate.now(),
//                    exercise.getReps(),
//                    exercise.getWeight(),
//                    trainingName,
//                    exercise.getIndex());
//        }).collect(Collectors.toList());
//    }
}
