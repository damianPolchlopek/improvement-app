package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.workouts.converters.TrainingTypeConverter;
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
import com.improvement_app.workouts.request.ExerciseRequest;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import jakarta.persistence.EntityNotFoundException;
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
    private final UserRepository userRepository;
    private final TrainingTemplateService trainingTemplateService;

    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;

    @Transactional
    public List<ExerciseEntity> findByDateOrderByIndex(Long userId, LocalDate date) {
        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingUserIdAndTrainingDate(userId, date);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("date", date.toString(), userId);
        }

        return exercises;
    }

    @Transactional
    public List<ExerciseEntity> findByNameReverseSorted(Long userId, String name) {
        ExerciseName exerciseName = ExerciseName.fromValue(name);
        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(userId, exerciseName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("name", name, userId);
        }

        return exercises;
    }

    @Transactional
    public List<ExerciseEntity> findByNameOrderByDate(Long userId, String name, LocalDate beginDateLD, LocalDate endDateLD) {
        ExerciseName exerciseName = ExerciseName.fromValue(name);

        return exerciseRepository.findByTrainingUserIdAndNameAndTrainingDateBetweenOrderByTrainingDate(
                userId,
                exerciseName,
                beginDateLD,
                endDateLD
        );
    }

    @Transactional
    public List<ExerciseEntity> findByTrainingNameOrderByIndex(Long userId, String trainingName) {
        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingUserIdAndTrainingName(userId, trainingName);

        if (exercises.isEmpty()) {
            throw new ExercisesNotFoundException("trainingName", trainingName, userId);
        }

        return exercises;
    }

    @Transactional
    public Page<String> getAllTrainingNames(Long userId, Pageable page) {
        return trainingRepository.findByUserId(userId, page)
                .map(TrainingEntity::getName);
    }

    public List<ExerciseEntity> getATHExercise(Long userId, String trainingTypeShortcut) {
        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

        return trainingTemplate.getExercises().stream()
                .map(exercise -> getMaximumCapacityExercise(userId, exercise.getName()))
                .flatMap(Optional::stream)
                .toList();
    }

    private Optional<ExerciseEntity> getMaximumCapacityExercise(Long userId, String exerciseName) {
        final ExerciseName name = ExerciseName.fromValue(exerciseName);

        List<ExerciseEntity> exercises = exerciseRepository.findByTrainingUserIdAndNameOrderByTrainingDateDesc(userId, name);

        if (exercises.isEmpty()) {
            return Optional.empty();
        }

        return exercises.stream()
                .max(Comparator.comparingDouble(exercise -> exercise.getExerciseSets()
                        .stream()
                        .map(ExerciseSetEntity::getCapacity)
                        .reduce(0.0, Double::sum)));
    }

    public List<ExerciseEntity> generateTrainingFromTemplate(Long userId, String trainingTypeShortcut) {
        TrainingTemplateEntity trainingTemplate = trainingTemplateService.getTrainingTemplate(trainingTypeShortcut);

        return trainingTemplate.getExercises().stream()
                .map(exerciseNameEntity -> getLatestExercise(userId, ExerciseName.fromValue(exerciseNameEntity.getName())))
                .toList();
    }

    private ExerciseEntity getLatestExercise(Long userId, ExerciseName exerciseName) {
        return exerciseRepository.findFirstByTrainingUserIdAndNameOrderByTrainingDateDesc(userId, exerciseName)
                .orElseGet(() -> new ExerciseEntity(exerciseName));
    }

    public Page<TrainingEntity> getLastTrainings(Long userId, String type, Pageable page) {
        final String dbExerciseType = TrainingTypeConverter.toExerciseType(type);
        final ExerciseType exerciseType = ExerciseType.valueOf(dbExerciseType);

        Page<TrainingEntity> trainings = trainingRepository.findDistinctByUserIdAndExercisesTypeOrderByDateDesc(userId, exerciseType, page);

        trainings.getContent().forEach(training -> {
            Hibernate.initialize(training.getExercises());
            training.getExercises().forEach(exercise ->
                    Hibernate.initialize(exercise.getExerciseSets())
            );
        });

        return trainings;
    }

    public TrainingEntity addTraining(Long userId, List<ExerciseRequest> exerciseRequest) {
        if (exerciseRequest == null || exerciseRequest.isEmpty()) {
            log.warn("Lista ExerciseRequest jest pusta lub null");
        }

        ExerciseEntity latestExercise = findLatestExercise(userId);

        ExerciseType type = ExerciseType.fromValue(exerciseRequest.get(0).getType());
        String trainingName = DriveFilesHelper.generateFileName(type, latestExercise);
        String excelFileLocation = createTrainingExcelFile(exerciseRequest, trainingName);
        uploadTrainingToGoogleDrive(excelFileLocation, trainingName);

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        TrainingEntity training = TrainingEntity.from(exerciseRequest);
        training.setName(trainingName);
        training.setUser(userEntity);

        return trainingRepository.save(training);
    }

    private ExerciseEntity findLatestExercise(Long userId) {
        return exerciseRepository.findTopByTrainingUserIdOrderByTrainingDateDesc(userId);
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
