package com.improvement_app.googleDrive.service;

import com.improvement_app.ApplicationVariables;
import com.improvement_app.googleDrive.helper.GoogleDriveHelperService;
import com.improvement_app.googleDrive.types.MimeType;
import com.improvement_app.googleDrive.entity.DriveFileItemDTO;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercises_fields.Name;
import com.improvement_app.workouts.entity.exercises_fields.Place;
import com.improvement_app.workouts.entity.exercises_fields.Progress;
import com.improvement_app.workouts.entity.exercises_fields.Type;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.services.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.improvement_app.ApplicationVariables.DRIVE_TRAININGS_FOLDER_NAME;

@Service
@RequiredArgsConstructor
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final Resource TMP_FILES_PATH = ApplicationVariables.pathToExcelsFiles;
    private static final String EXCEL_EXTENSION = ApplicationVariables.EXCEL_EXTENSION;
    private static final Logger LOGGER = Logger.getLogger(GoogleDriveServiceImpl.class);

    private final GoogleDriveHelperService googleDriveHelperService;
    private final ExerciseService exerciseService;

    @Override
    public List<Exercise> saveAllExercisesToDB(final String folderName) throws IOException{
        LOGGER.info("Zapisuje cwiczenia do bazy danych z google drive z folderu: " + folderName);

        final List<DriveFileItemDTO> responseList = googleDriveHelperService.getDriveFiles(folderName);
        final List<Exercise> exercises = new ArrayList<>();
        // TODO: sprawdzic czy to mozna usunac (trainingsName)
        final List<String> trainingsName = exerciseService.getAllTrainingNames();

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            final String trainingName = driveFileItemDTO.getName();

            if (!trainingsName.contains(trainingName)) {
                googleDriveHelperService.downloadFile(driveFileItemDTO);
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
        final String folderName = ApplicationVariables.DRIVE_CATEGORIES_FOLDER_NAME;
        final List<DriveFileItemDTO> responseList = googleDriveHelperService.getDriveFiles(folderName);

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            googleDriveHelperService.downloadFile(driveFileItemDTO);

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
            exerciseService.deleteAllExerciseNames();
            List<Name> nameList = values.stream()
                    .map(Name::new)
                    .collect(Collectors.toList());

            exerciseService.saveAllExerciseNames(nameList);
        } else if (fileName.contains(PLACES)) {
            exerciseService.deleteAllExercisePlaces();
            List<Place> placeList = values.stream()
                    .map(Place::new)
                    .collect(Collectors.toList());

            exerciseService.saveAllExercisePlaces(placeList);
        } else if (fileName.contains(PROGRESSES)) {
            exerciseService.deleteAllExerciseProgresses();
            List<Progress> progressList = values.stream()
                    .map(Progress::new)
                    .collect(Collectors.toList());

            exerciseService.saveAllExerciseProgresses(progressList);
        } else if (fileName.contains(TYPES)) {
            exerciseService.deleteAllExerciseTypes();
            List<Type> typeList = values.stream()
                    .map(Type::new)
                    .collect(Collectors.toList());

            exerciseService.saveAllExerciseTypes(typeList);
        }
    }

    @Override
    public void initApplicationExercises() throws IOException{
        exerciseService.deleteAllExercises();
        saveAllExercisesToDB(DRIVE_TRAININGS_FOLDER_NAME);
    }

    @Override
    public void deleteTraining(String trainingName) throws IOException{
        final String fileId = googleDriveHelperService.getGoogleDriveObjectId(trainingName, MimeType.DRIVE_SHEETS);
        googleDriveHelperService.deleteFile(fileId);
    }

}