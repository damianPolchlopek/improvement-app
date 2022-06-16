package com.improvement_app.workouts.services;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.improvement_app.workouts.dto.DriveFileItemDTO;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercises_fields.Name;
import com.improvement_app.workouts.entity.exercises_fields.Place;
import com.improvement_app.workouts.entity.exercises_fields.Progress;
import com.improvement_app.workouts.entity.exercises_fields.Type;
import com.improvement_app.workouts.exceptions.TooMuchGoogleDriveFilesException;
import com.improvement_app.workouts.helpers.ApplicationVariables;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.types.MimeType;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.improvement_app.workouts.helpers.ApplicationVariables.DRIVE_TRAININGS_FOLDER_NAME;

@Service
@RequiredArgsConstructor
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final Resource TMP_FILES_PATH = ApplicationVariables.pathToExcelsFiles;
    private static final String EXCEL_EXTENSION = ApplicationVariables.EXCEL_EXTENSION;
    private static final Logger LOGGER = Logger.getLogger(GoogleDriveServiceImpl.class);

    private final Drive drive;
    private final ExerciseService exerciseService;

    @Override
    public List<Exercise> saveAllExercisesToDB(final String folderName) throws IOException{
        LOGGER.info("Zapisuje cwiczenia do bazy danych z google drive z folderu: " + folderName);

        final List<DriveFileItemDTO> responseList = getDriveFiles(folderName);
        final List<Exercise> exercises = new ArrayList<>();
        final List<String> trainingsName = exerciseService.getAllTrainingNames();

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            final String trainingName = driveFileItemDTO.getName();

            if (!trainingsName.contains(trainingName)) {
                downloadFile(driveFileItemDTO);
                trainingsName.add(trainingName);

                LOGGER.info("Dodaje do bazy danych trening o nazwie: " + trainingName);

                final String fileName = TMP_FILES_PATH + trainingName + EXCEL_EXTENSION;
                java.io.File file = new java.io.File(fileName);
                exercises.addAll(DriveFilesHelper.parseExcelTrainingFile(file));
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
        final List<DriveFileItemDTO> responseList = getDriveFiles(folderName);

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            downloadFile(driveFileItemDTO);

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
        final String fileId = getGoogleDriveObjectId(trainingName, MimeType.DRIVE_SHEETS);
        drive.files().delete(fileId).execute();
    }

    private String getGoogleDriveObjectId(final String googleDriveFileName,
                                          final MimeType type) throws IOException {
        final String query = "mimeType='" + type.getType()
                + "' and name contains '" + googleDriveFileName + "' ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new TooMuchGoogleDriveFilesException("Return more than one folder");

        final List<DriveFileItemDTO> responseList = allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());

        return responseList.get(0).getId();
    }

    @Override
    public List<DriveFileItemDTO> getDriveFiles(final String folderName) throws IOException {
        final String folderId = getGoogleDriveObjectId(folderName, MimeType.DRIVE_FOLDER);
        final String query = "mimeType='" + MimeType.DRIVE_SHEETS.getType()
                + "' and '" + folderId + "' in parents ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        final List<File> allFiles = getAllFiles(request);

        return allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());
    }

    private List<File> getAllFiles(final Drive.Files.List request) {
        List<File> result = new ArrayList<>();
        do {
            try {
                FileList files = request.execute();

                result.addAll(files.getFiles());
                request.setPageToken(files.getNextPageToken());
            } catch (IOException e) {
                LOGGER.error("An error occurred: " + e);
                request.setPageToken(null);
            }
        } while (request.getPageToken() != null &&
                request.getPageToken().length() > 0);

        return result;
    }

    @Override
    public void downloadFile(final DriveFileItemDTO file) throws IOException {
        final String fileName = TMP_FILES_PATH + file.getName() + EXCEL_EXTENSION;
        drive.files().export(file.getId(), MimeType.EXCEL.getType())
                .executeMediaAndDownloadTo(new FileOutputStream(fileName));
    }

    @Override
    public void uploadFileInFolder(final String folderName,
                                   final java.io.File fileToUpload,
                                   final String fileName) throws IOException {

        final String folderId = getGoogleDriveObjectId(folderName, MimeType.DRIVE_FOLDER);

        final File file = new File();
        file.setName(fileName);
        file.setMimeType(MimeType.DRIVE_SHEETS.getType());
        file.setParents(Arrays.asList(folderId));

        final FileContent content = new FileContent(MimeType.EXCEL_DOWNLOAD.getType(), fileToUpload);
        drive.files().create(file, content).setFields("id").execute();
    }

}