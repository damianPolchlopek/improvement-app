package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import com.improvement_app.workouts.exceptions.ExercisesNotFoundException;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.repository.ExerciseEntityRepository;
import com.improvement_app.workouts.repository.TrainingEntityRepository;
import com.improvement_app.workouts.controllers.request.ExerciseRequest;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDate;
import java.util.*;

import static com.improvement_app.workouts.TrainingModuleVariables.DRIVE_TRAININGS_FOLDER_NAME;

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


    public List<ExerciseEntity> findByDateOrderByIndex(LocalDate date) {
        List<ExerciseEntity> exercises = exerciseRepository.findByTraining_Date(date);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("date", date.toString());
        }

        return exercises;
    }

    public List<ExerciseEntity> findByNameReverseSorted(String name) {
        List<ExerciseEntity> exercises = exerciseRepository.findByNameOrderByTraining_DateDesc(ExerciseName.fromValue(name));

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("name", name);
        }

        return exercises;
    }

    public List<ExerciseEntity> findByNameOrderByDate(String name, LocalDate beginDateLD, LocalDate endDateLD) {
        ExerciseName exerciseName = ExerciseName.fromValue(name);

        return exerciseRepository.findByNameAndTraining_DateBetweenOrderByTraining_Date(
                exerciseName,
                beginDateLD,
                endDateLD
        );
    }

    public List<ExerciseEntity> findByTrainingNameOrderByIndex(String trainingName) {
        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingName(trainingName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("trainingName", trainingName);
        }

        return exercises;
    }

    public Page<String> getAllTrainingNames(Pageable page) {
        return trainingRepository.findAllByOrderByDateDesc(page)
                .map(TrainingEntity::getName);
    }

    public List<ExerciseEntity> getATHExercise(String trainingTypeShortcut) {
        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

        return trainingTemplate.getExercises().stream()
                .map(exercise -> getMaximumCapacityExercise(exercise.getName()))
                .flatMap(Optional::stream)
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

    public List<ExerciseEntity> generateTrainingFromTemplate(String trainingTypeShortcut) {
        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

        return trainingTemplate.getExercises().stream()
                .map(exerciseNameEntity -> getLatestExercise(ExerciseName.fromValue(exerciseNameEntity.getName())))
                .toList();
    }

    private ExerciseEntity getLatestExercise(ExerciseName exerciseName) {
        return exerciseRepository.findFirstByNameOrderByTraining_DateDesc(exerciseName)
                .orElseGet(() -> new ExerciseEntity(exerciseName));
    }

    public Page<TrainingEntity> getLastTrainings(String type, Pageable page) {
        final String dbExerciseType = TrainingTypeConverter.toExerciseType(type);
        final ExerciseType exerciseType = ExerciseType.valueOf(dbExerciseType);

        Page<TrainingEntity> trainings = trainingRepository.findDistinctByExercisesTypeOrderByDateDesc(exerciseType, page);

        trainings.getContent().forEach(training -> {
            Hibernate.initialize(training.getExercises());
            training.getExercises().forEach(exercise ->
                    Hibernate.initialize(exercise.getExerciseSets())
            );
        });

        return trainings;
    }

    public TrainingEntity addTraining(List<ExerciseRequest> exerciseRequest) {
        if (exerciseRequest == null || exerciseRequest.isEmpty()) {
            log.warn("Lista ExerciseRequest jest pusta lub null");
        }

        ExerciseEntity latestExercise = findLatestExercise();

        ExerciseType type = ExerciseType.fromValue(exerciseRequest.get(0).getType());
        String trainingName = DriveFilesHelper.generateFileName(type, latestExercise);
        String excelFileLocation = createTrainingExcelFile(exerciseRequest, trainingName);
        uploadTrainingToGoogleDrive(excelFileLocation, trainingName);

        TrainingEntity training = TrainingEntity.from(exerciseRequest);
        training.setName(trainingName);

        return trainingRepository.save(training);
    }

    private ExerciseEntity findLatestExercise() {
        return exerciseRepository.findTopByOrderByTrainingDateDesc();
    }

    private String createTrainingExcelFile(List<ExerciseRequest> exercises, String trainingName) {
        String excelFileLocation = filePathService.getExcelPath(trainingName);
        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);
        return excelFileLocation;
    }

    private void uploadTrainingToGoogleDrive(String excelFileLocation, String trainingName) {
        File file = new File(excelFileLocation);
        googleDriveFileService.uploadFile(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);
    }
}
