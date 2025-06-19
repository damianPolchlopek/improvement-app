package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity2.ExerciseEntity;
import com.improvement_app.workouts.entity2.ExerciseSetEntity;
import com.improvement_app.workouts.entity2.TrainingEntity;
import com.improvement_app.workouts.entity2.TrainingTemplateEntity;
import com.improvement_app.workouts.entity2.enums.ExerciseName;
import com.improvement_app.workouts.entity2.enums.ExerciseType;
import com.improvement_app.workouts.exceptions.ExercisesNotFoundException;
import com.improvement_app.workouts.repository2.ExerciseEntityRepository;
import com.improvement_app.workouts.repository2.TrainingEntityRepository;
import com.improvement_app.workouts.response.ExerciseResponse;
import com.improvement_app.workouts.response.TrainingDayResponse;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseService {

    private final ExerciseEntityRepository exerciseRepository;
    private final TrainingEntityRepository trainingRepository;

    private final TrainingTemplateService trainingTemplateService;
    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;


    public List<ExerciseResponse> findByDateOrderByIndex(LocalDate date) {
        List<ExerciseEntity> exercises = exerciseRepository.findByTraining_Date(date);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("date", date.toString());
        }

        return exercises.stream()
                .map(ExerciseResponse::new)
                .toList();
    }

    public List<ExerciseResponse> findByNameReverseSorted(String name) {
        List<ExerciseEntity> exercises = exerciseRepository.findByNameOrderByTraining_DateDesc(ExerciseName.fromValue(name));

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("name", name);
        }

        return exercises.stream()
                .map(ExerciseResponse::new)
                .toList();
    }

    public List<ExerciseEntity> findByNameOrderByDate(String name, LocalDate beginDateLD, LocalDate endDateLD) {
        ExerciseName exerciseName = ExerciseName.fromValue(name);

        return exerciseRepository.findByNameAndTraining_DateBetweenOrderByTraining_Date(
                exerciseName,
                beginDateLD,
                endDateLD
        );
    }

    public List<ExerciseResponse> findByTrainingNameOrderByIndex(String trainingName) {
        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingName(trainingName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("trainingName", trainingName);
        }

        return exercises.stream()
                .map(ExerciseResponse::new)
                .toList();
    }

    public Page<String> getAllTrainingNames(Pageable page) {
        List<String> trainingNames = getAllTrainingNames();
//        return PaginationHelper.getPage(trainingNames, page.getPageNumber() + 1, page.getPageSize());
        return null;
    }

    private List<String> getAllTrainingNames() {
        List<TrainingEntity> exercises = trainingRepository.findAllByOrderByDateDesc();

        return exercises.stream()
                .map(TrainingEntity::getName)
                .toList();
    }

    public List<ExerciseResponse> getATHExercise(String trainingTypeShortcut) {
        String convertedTrainingType = TrainingTypeConverter.toExerciseType(trainingTypeShortcut);

        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

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

    public Page<TrainingDayResponse> getLastTrainings2(String type, Pageable page) {
        final String dbExerciseType = TrainingTypeConverter.toExerciseType(type);
        final ExerciseType exerciseType = ExerciseType.valueOf(dbExerciseType);

        Page<TrainingEntity> distinctByExercisesType =
                trainingRepository.findDistinctByExercisesTypeOrderByDateDesc(exerciseType, page);

        return distinctByExercisesType
                .map(this::mapToTrainingDayResponse);
    }

    private TrainingDayResponse mapToTrainingDayResponse(TrainingEntity training) {

        Map<String, ExerciseResponse> exerciseMap = training.getExercises().stream()
                .collect(Collectors.toMap(
                        e -> e.getName().getValue(),
                        ExerciseResponse::new,
                        (existing, duplicate) -> existing,
                        LinkedHashMap::new
                ));

        return new TrainingDayResponse(training.getDate(), exerciseMap);
    }

    public Page<LinkedHashMap<String, ExerciseResponse>> getLastTrainings(String type, Pageable page) {
        final String dbExerciseType = TrainingTypeConverter.toExerciseType(type);
        final ExerciseType exerciseType = ExerciseType.valueOf(dbExerciseType);

        List<String> exercises = exerciseRepository.findByType(exerciseType)
                .stream()
                .map(e -> e.getTraining().getName())
                .distinct()
                .toList();

        List<ExerciseEntity> byDate = exerciseRepository.findByTrainingNameIn(exercises);

        List<LinkedHashMap<String, ExerciseResponse>> collect = byDate.stream()
                // Sortowanie ćwiczeń według daty treningu malejąco
                .sorted(Comparator.comparing((ExerciseEntity e) -> e.getTraining().getDate()).reversed())
                // Grupowanie według dnia treningu, następnie grupowanie według nazwy ćwiczenia
                .collect(Collectors.groupingBy(
                        e -> e.getTraining().getDate(),
                        LinkedHashMap::new,
                        Collectors.toMap(
                                e -> e.getName().getValue(),
                                ExerciseResponse::new,
                                (e1, e2) -> e1,
                                LinkedHashMap::new
                        )
                ))
                // Przekształcenie mapy do listy map
                .values().stream()
                .collect(Collectors.toList());

//        return PaginationHelper.getPage(collect, page.getPageNumber() + 1, page.getPageSize());
        return null;
    }


    private ExerciseResponse getLatestExercise(String exerciseName) {
        return exerciseRepository.findFirstByNameOrderByTraining_DateDesc(exerciseName)
                .map(ExerciseResponse::new)
                .orElseGet(() -> new ExerciseResponse(exerciseName)); // Tworzenie nowego ćwiczenia, jeśli brak w historii
    }
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
