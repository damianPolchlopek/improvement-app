package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.service.FileDownloadService;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.exceptions.GoogleDriveFileNotDownloadedException;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.security.services.UserDetailsServiceImpl;
import com.improvement_app.workouts.entity.ExerciseNameEntity;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.services.data.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.improvement_app.workouts.TrainingModuleVariables.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitializationService {

    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;
    private final ExerciseNameService exerciseNameService;
    private final TrainingService trainingService;
    private final TrainingTemplateService trainingTemplateService;
    private final SimpMessagingTemplate messagingTemplate;
    private final FileDownloadService fileDownloadService;

    private final UserRepository userRepository;



    public void initApplicationTrainings(Long userId) {
        log.info("Usuwam wszystkie zapisane treningi");
        trainingService.deleteAllTrainings();

        log.info("Dodaje nowe treningi do bazy danych treningowej");
        List<TrainingEntity> trainings = importTrainingsFromDrive(DRIVE_TRAININGS_FOLDER_NAME);

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        for (TrainingEntity training : trainings) {
            training.setUser(userEntity);
        }

        trainingService.saveAll(trainings);
        log.info("Dodane treningi: {}", trainings);
    }

    //TODO: Sprawdzenie czy trening istnieje jak tak, to usuń stary
    private List<TrainingEntity> importTrainingsFromDrive(String folderName) {
        log.info("Import ćwiczeń z folderu Google Drive: {}", folderName);

        List<DriveFileItemDTO> driveFiles = googleDriveFileService.listFiles(folderName);
        List<TrainingEntity> parsedTrainings = new ArrayList<>();

//        driveFiles.size()
        for (int i = 0; i < driveFiles.size() ; i++) {
            DriveFileItemDTO fileItem = driveFiles.get(i);
            String trainingName = fileItem.getName();

            if (trainingName.contains("Kopia")) {
                log.warn("Pominięto trening z nazwą zawierającą 'Kopia': {}", trainingName);
                continue;
            }

            try {
                googleDriveFileService.downloadFile(fileItem);

                String logMsg = String.format("(%d/%d) Import treningu: %s", i + 1, driveFiles.size(), trainingName);
                log.info(logMsg);
                messagingTemplate.convertAndSend("/topic/messages", logMsg);

                File file = filePathService.getDownloadedFile(trainingName);
                TrainingEntity parsed = DriveFilesHelper.parseExcelTrainingFile(file);
                parsedTrainings.add(parsed);

            } catch (Exception e) {
                log.error("Błąd przy przetwarzaniu treningu: {}", trainingName, e);
            }
        }

        return parsedTrainings;
    }


    public void initApplicationTemplates() {
        log.info("Inicjalizacja szablonów treningowych...");
        List<ExerciseNameEntity> exerciseNameEntities = initExerciseNames();

        if (exerciseNameEntities == null || exerciseNameEntities.isEmpty()) {
            log.warn("Brak nazw ćwiczeń do inicjalizacji szablonów treningowych.");
            return;
        }

        List<TrainingTemplateEntity> trainingTemplateEntities = initApplicationTrainingTemplates(exerciseNameEntities);
        if (trainingTemplateEntities == null || trainingTemplateEntities.isEmpty()) {
            log.warn("Brak szablonów treningowych do inicjalizacji.");
            return;
        }

        log.info("Szablony treningowe zainicjalizowane.");
    }

    private List<ExerciseNameEntity> initExerciseNames() {
        exerciseNameService.deleteAllExerciseNames();
        exerciseNameService.flush();

        List<ExerciseNameEntity> exerciseNameEntities = downloadAndParseExerciseNames();
        return exerciseNameService.saveAllExerciseNames(exerciseNameEntities);
    }

    private List<ExerciseNameEntity> downloadAndParseExerciseNames() {
        try {
            File exerciseNameFile = fileDownloadService.downloadFile(EXERCISE_NAMES_FILE_NAME);
            if (exerciseNameFile.exists()) {
                List<String> values = DriveFilesHelper.parseExcelSimpleFile(exerciseNameFile);

                return values
                        .stream()
                        .map(ExerciseNameEntity::new)
                        .toList();
            } else {
                log.warn("Pobrany plik nie istnieje: {}", exerciseNameFile.getPath());
            }
        } catch (IOException e) {
            throw new GoogleDriveFileNotDownloadedException(e);
        }

        return null;
    }

    private List<TrainingTemplateEntity> initApplicationTrainingTemplates(List<ExerciseNameEntity> exerciseNameEntities) {
        Map<String, ExerciseNameEntity> exerciseNamesMap = exerciseNameEntities.stream()
                .collect(Collectors.toMap(
                        ExerciseNameEntity::getName,
                        Function.identity()
                ));

        List<DriveFileItemDTO> driveFiles = googleDriveFileService.listFiles(DRIVE_TRAINING_TEMPLATES_FOLDER_NAME);

        List<TrainingTemplateEntity> templates = driveFiles.stream()
                .map(fileItem -> createTrainingTemplate(fileItem, exerciseNamesMap))
                .filter(Objects::nonNull)
                .toList();

        trainingTemplateService.deleteAllTrainingTemplates();
        List<TrainingTemplateEntity> saved = trainingTemplateService.saveAllTrainingTemplates(templates);
        log.info("Zapisane plany treningowe: {}", saved);

        return saved;
    }

    private TrainingTemplateEntity createTrainingTemplate(DriveFileItemDTO fileItem, Map<String, ExerciseNameEntity> exerciseMap) {
        try {
            googleDriveFileService.downloadFile(fileItem);
            File file = filePathService.getDownloadedFile(fileItem.getName());
            List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);

            TrainingTemplateEntity trainingTemplateEntity = new TrainingTemplateEntity(fileItem.getName());
            for (String value : values) {
                ExerciseNameEntity exerciseNameEntity = exerciseMap.get(value);
                trainingTemplateEntity.addExercise(exerciseNameEntity);
            }

            return trainingTemplateEntity;
        } catch (Exception e) {
            log.error("Nie udało się sparsować szablonu: {}", fileItem.getName(), e);
            return null;
        }
    }

}
