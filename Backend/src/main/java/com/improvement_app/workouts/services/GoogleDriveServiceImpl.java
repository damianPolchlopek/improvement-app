package com.improvement_app.workouts.services;

import com.improvement_app.ApplicationVariables;
import com.improvement_app.googledrive.entity.DriveFileItemDTO;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.googledrive.types.MimeType;
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
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.improvement_app.workouts.TrainingModuleVariables.*;

@Service
@RequiredArgsConstructor
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final String TMP_FILES_PATH = ApplicationVariables.PATH_TO_EXCEL_FILES;
    private static final String EXCEL_EXTENSION = ApplicationVariables.EXCEL_EXTENSION;
    private static final Logger LOGGER = Logger.getLogger(GoogleDriveServiceImpl.class);

    private final GoogleDriveFileService googleDriveFileService;
    private final ExerciseService exerciseService;
    private final ExerciseTypeService exerciseTypeService;
    private final ExerciseNameService exerciseNameService;
    private final ExerciseProgressService exerciseProgressService;
    private final ExercisePlaceService exercisePlaceService;
    private final TrainingTemplateService trainingTemplateService;

    @Override
    public List<Exercise> saveAllExercisesToDB(final String folderName) throws IOException{
        LOGGER.info("Zapisuje cwiczenia do bazy danych z google drive z folderu: " + folderName);

        final List<DriveFileItemDTO> responseList = googleDriveFileService.getDriveFiles(folderName);
        final List<Exercise> exercises = new ArrayList<>();
        // TODO: sprawdzic czy to mozna usunac (trainingsName)
        final List<String> trainingsName = exerciseService.getAllTrainingNames();

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            final String trainingName = driveFileItemDTO.getName();

            if (!trainingsName.contains(trainingName)) {
                googleDriveFileService.downloadFile(driveFileItemDTO);
                trainingsName.add(trainingName);

                LOGGER.info("Dodaje do bazy danych trening o nazwie: " + trainingName);

                final String fileName = TMP_FILES_PATH + trainingName + EXCEL_EXTENSION;
                java.io.File file = new java.io.File(fileName);
                List<Exercise> parsedExercises = DriveFilesHelper.parseExcelTrainingFile(file);
                exercises.addAll(parsedExercises);
            } else {
                LOGGER.info("Trening o nazwie: " + trainingName + ", juz istnieje w bazie danych");
            }
        }

        List<Exercise> filterExercise = ExercisesHelper.filterExerciseList(exercises);
        exerciseService.saveAll(filterExercise);

        return exercises;
    }

    @Override
    public void initApplicationCategories() throws IOException {
        final List<DriveFileItemDTO> responseList = googleDriveFileService.getDriveFiles(DRIVE_CATEGORIES_FOLDER_NAME);

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveFileService.downloadFile(driveFileItemDTO);

            final String fileName = TMP_FILES_PATH + driveFileItemDTO.getName() + EXCEL_EXTENSION;
            final java.io.File file = new java.io.File(fileName);

            final List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);
            saveDataToDatabase(values, fileName);
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
                    .collect(Collectors.toList());

            exerciseNameService.saveAllExerciseNames(nameList);
        } else if (fileName.contains(PLACES)) {
            exercisePlaceService.deleteAllExercisePlaces();
            List<Place> placeList = values.stream()
                    .map(Place::new)
                    .collect(Collectors.toList());

            exercisePlaceService.saveAllExercisePlaces(placeList);
        } else if (fileName.contains(PROGRESSES)) {
            exerciseProgressService.deleteAllExerciseProgresses();
            List<Progress> progressList = values.stream()
                    .map(Progress::new)
                    .collect(Collectors.toList());

            exerciseProgressService.saveAllExerciseProgresses(progressList);
        } else if (fileName.contains(TYPES)) {
            exerciseTypeService.deleteAllExerciseTypes();
            List<Type> typeList = values.stream()
                    .map(Type::new)
                    .collect(Collectors.toList());

            exerciseTypeService.saveAllExerciseTypes(typeList);
        }
    }

    @Override
    public void initApplicationExercises() throws IOException{
        exerciseService.deleteAllExercises();
        saveAllExercisesToDB(DRIVE_TRAININGS_FOLDER_NAME);
    }

    @Override
    public void initApplicationTrainingTemplates() throws IOException {
        final List<DriveFileItemDTO> responseList
                = googleDriveFileService.getDriveFiles(DRIVE_TRAINING_TEMPLATES_FOLDER_NAME);

        List<TrainingTemplate> trainingTemplates = new ArrayList<>();
        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveFileService.downloadFile(driveFileItemDTO);

            final String fileName = TMP_FILES_PATH + driveFileItemDTO.getName() + EXCEL_EXTENSION;
            final java.io.File file = new java.io.File(fileName);

            final List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);

            trainingTemplates.add(new TrainingTemplate(driveFileItemDTO.getName(), values));
        }

        trainingTemplateService.deleteAllTrainingTemplates();
        trainingTemplateService.saveAllTrainingTemplates(trainingTemplates);
    }

    @Override
    public void deleteTraining(String trainingName) throws IOException{
        final String fileId = googleDriveFileService.getGoogleDriveObjectId(trainingName, MimeType.DRIVE_SHEETS);
        googleDriveFileService.deleteFile(fileId);
    }

}