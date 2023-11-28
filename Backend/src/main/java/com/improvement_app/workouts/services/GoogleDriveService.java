package com.improvement_app.workouts.services;

import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.service.FilePathService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.entity.exercisesfields.Place;
import com.improvement_app.workouts.entity.exercisesfields.Progress;
import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.services.data.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

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

    public void initApplicationCategories() {
        final List<DriveFileItemDTO> responseList = googleDriveFileService.getDriveFiles(DRIVE_CATEGORIES_FOLDER_NAME);

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveFileService.downloadFile(driveFileItemDTO);

            final File file = filePathService.getDownloadedFile(driveFileItemDTO.getName());

            final List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);
            saveDataToDatabase(values, file.getPath());
        }
    }

    private void saveDataToDatabase(List<String> values, String fileName) {
        final String NAMES = "Names";
        final String PLACES = "Places";
        final String PROGRESSES = "Progresses";
        final String TYPES = "Types";

        if (fileName.contains(NAMES)) {
            exerciseNameService.deleteAllExerciseNames();
            List<Name> nameList = values.stream()
                    .map(Name::new)
                    .toList();

            exerciseNameService.saveAllExerciseNames(nameList);
        } else if (fileName.contains(PLACES)) {
            exercisePlaceService.deleteAllExercisePlaces();
            List<Place> placeList = values.stream()
                    .map(Place::new)
                    .toList();

            exercisePlaceService.saveAllExercisePlaces(placeList);
        } else if (fileName.contains(PROGRESSES)) {
            exerciseProgressService.deleteAllExerciseProgresses();
            List<Progress> progressList = values.stream()
                    .map(Progress::new)
                    .toList();

            exerciseProgressService.saveAllExerciseProgresses(progressList);
        } else if (fileName.contains(TYPES)) {
            exerciseTypeService.deleteAllExerciseTypes();
            List<Type> typeList = values.stream()
                    .map(Type::new)
                    .toList();

            exerciseTypeService.saveAllExerciseTypes(typeList);
        }
    }

    public void initApplicationExercises() {
        exerciseService.deleteAllExercises();
        List<Exercise> exercises = saveAllExercisesToDB(DRIVE_TRAININGS_FOLDER_NAME);
        log.info("Dodane cwiczenia: %s".formatted(exercises));
    }

    private List<Exercise> saveAllExercisesToDB(final String folderName) {
        log.info("Zapisuje cwiczenia do bazy danych z google drive z folderu: %s".formatted(folderName));

        final List<DriveFileItemDTO> responseList = googleDriveFileService.getDriveFiles(folderName);
        final List<Exercise> exercises = new ArrayList<>();
        // TODO: sprawdzic czy to mozna usunac (trainingsName)
        final List<String> trainingsName = exerciseService.getAllTrainingNames();

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            final String trainingName = driveFileItemDTO.getName();

            if (!trainingsName.contains(trainingName)) {
                googleDriveFileService.downloadFile(driveFileItemDTO);
                trainingsName.add(trainingName);

                log.info("Dodaje do bazy danych trening o nazwie: %s".formatted(trainingName));

                File file = filePathService.getDownloadedFile(trainingName);
                List<Exercise> parsedExercises = DriveFilesHelper.parseExcelTrainingFile(file);
                exercises.addAll(parsedExercises);
            } else {
                log.info("Trening o nazwie: %s, juz istnieje w bazie danych".formatted(trainingName));
            }
        }

        List<Exercise> filterExercise = ExercisesHelper.filterExerciseList(exercises);
        exerciseService.saveAll(filterExercise);
        log.info("Aktualizacja Treningów zakończona :)");

        return exercises;
    }

    public void initApplicationTrainingTemplates() {
        final List<DriveFileItemDTO> responseList
                = googleDriveFileService.getDriveFiles(DRIVE_TRAINING_TEMPLATES_FOLDER_NAME);

        List<TrainingTemplate> trainingTemplates = new ArrayList<>();
        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveFileService.downloadFile(driveFileItemDTO);

            final File file = filePathService.getDownloadedFile(driveFileItemDTO.getName());
            final List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);

            trainingTemplates.add(new TrainingTemplate(driveFileItemDTO.getName(), values));
        }

        trainingTemplateService.deleteAllTrainingTemplates();
        trainingTemplateService.saveAllTrainingTemplates(trainingTemplates);
    }

}