package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.entity.exercisesfields.Place;
import com.improvement_app.workouts.entity.exercisesfields.Progress;
import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.services.data.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.improvement_app.workouts.TrainingModuleVariables.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleDriveService {

    private final GoogleDriveFileService googleDriveFileService;
    private final FilePathService filePathService;

    private final ExerciseService exerciseService;
    private final ExerciseTypeService exerciseTypeService;
    private final ExerciseNameService exerciseNameService;
    private final ExerciseProgressService exerciseProgressService;
    private final ExercisePlaceService exercisePlaceService;
    private final TrainingTemplateService trainingTemplateService;
    private final SimpMessagingTemplate messagingTemplate;

    private static final Map<String, Function<List<String>, ?>> DATA_MAPPERS = Map.of(
        "Names", (List<String> values) -> values.stream().map(Name::new).toList(),
        "Places", (List<String> values) -> values.stream().map(Place::new).collect(Collectors.toList()),
        "Progresses", (List<String> values) -> values.stream().map(Progress::new).collect(Collectors.toList()),
        "Types", (List<String> values) -> values.stream().map(Type::new).collect(Collectors.toList())
    );

    public void initApplicationCategories() {
        List<DriveFileItemDTO> driveFiles = googleDriveFileService.listFiles(DRIVE_CATEGORIES_FOLDER_NAME);
        for (DriveFileItemDTO fileItem : driveFiles) {
            try {
                googleDriveFileService.downloadFile(fileItem);
                File file = filePathService.getDownloadedFile(fileItem.getName());
                if (file.exists()) {
                    List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);
                    processCategoryData(file.getPath(), values);
                } else {
                    log.warn("Pobrany plik nie istnieje: {}", file.getPath());
                }
            } catch (Exception e) {
                log.error("Błąd podczas przetwarzania pliku kategorii: {}", fileItem.getName(), e);
            }
        }
    }

    private void processCategoryData(String fileName, List<String> values) {
        for (Map.Entry<String, Function<List<String>, ?>> entry : DATA_MAPPERS.entrySet()) {
            if (fileName.contains(entry.getKey())) {
                switch (entry.getKey()) {
                    case "Names" -> {
                        exerciseNameService.deleteAllExerciseNames();
                        exerciseNameService.saveAllExerciseNames((List<Name>) entry.getValue().apply(values));
                    }
                    case "Places" -> {
                        exercisePlaceService.deleteAllExercisePlaces();
                        exercisePlaceService.saveAllExercisePlaces((List<Place>) entry.getValue().apply(values));
                    }
                    case "Progresses" -> {
                        exerciseProgressService.deleteAllExerciseProgresses();
                        exerciseProgressService.saveAllExerciseProgresses((List<Progress>) entry.getValue().apply(values));
                    }
                    case "Types" -> {
                        exerciseTypeService.deleteAllExerciseTypes();
                        exerciseTypeService.saveAllExerciseTypes((List<Type>) entry.getValue().apply(values));
                    }
                }
                return;
            }
        }
        log.warn("Nie rozpoznano kategorii dla pliku: {}", fileName);
    }

    public void initApplicationExercises() {
        exerciseService.deleteAllExercises();
        List<Exercise> exercises = importExercisesFromDrive(DRIVE_TRAININGS_FOLDER_NAME);
        log.info("Dodane ćwiczenia: {}", exercises);
    }

    private List<Exercise> importExercisesFromDrive(String folderName) {
        log.info("Import ćwiczeń z folderu Google Drive: {}", folderName);

        List<DriveFileItemDTO> driveFiles = googleDriveFileService.listFiles(folderName);
        Set<String> existingTrainingNames = new HashSet<>(exerciseService.getAllTrainingNames());

        List<Exercise> allParsedExercises = new ArrayList<>();

        for (int i = 0; i < driveFiles.size(); i++) {
            DriveFileItemDTO fileItem = driveFiles.get(i);
            String trainingName = fileItem.getName();

            if (existingTrainingNames.contains(trainingName)) {
                log.info("Trening '{}' już istnieje w bazie danych", trainingName);
                continue;
            }

            try {
                googleDriveFileService.downloadFile(fileItem);
                existingTrainingNames.add(trainingName);

                String logMsg = String.format("(%d/%d) Import treningu: %s", i + 1, driveFiles.size(), trainingName);
                log.info(logMsg);
                messagingTemplate.convertAndSend("/topic/messages", logMsg);

                File file = filePathService.getDownloadedFile(trainingName);
                List<Exercise> parsed = DriveFilesHelper.parseExcelTrainingFile(file);
                allParsedExercises.addAll(parsed);

            } catch (Exception e) {
                log.error("Błąd przy przetwarzaniu treningu: {}", trainingName, e);
            }
        }

        List<Exercise> filteredExercises = allParsedExercises.stream()
                .filter(e -> !e.getTrainingName().contains("Kopia"))
                .toList();

        exerciseService.saveAll(filteredExercises);
        log.info("Aktualizacja treningów zakończona.");
        return filteredExercises;
    }

    public void initApplicationTrainingTemplates() {
        List<DriveFileItemDTO> driveFiles = googleDriveFileService.listFiles(DRIVE_TRAINING_TEMPLATES_FOLDER_NAME);

        List<TrainingTemplate> templates = driveFiles.stream()
                .map(fileItem -> {
                    try {
                        googleDriveFileService.downloadFile(fileItem);
                        File file = filePathService.getDownloadedFile(fileItem.getName());
                        List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);
                        return new TrainingTemplate(fileItem.getName(), values);
                    } catch (Exception e) {
                        log.error("Nie udało się sparsować szablonu: {}", fileItem.getName(), e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();

        trainingTemplateService.deleteAllTrainingTemplates();
        List<TrainingTemplate> saved = trainingTemplateService.saveAllTrainingTemplates(templates);
        log.info("Zapisane plany treningowe: {}", saved);
    }
}
