package com.improvementApp.workouts.services;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.controllers.ExerciseController;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.ExercisesFields.Name;
import com.improvementApp.workouts.entity.ExercisesFields.Place;
import com.improvementApp.workouts.entity.ExercisesFields.Progress;
import com.improvementApp.workouts.entity.ExercisesFields.Type;
import com.improvementApp.workouts.helpers.ApplicationVariables;
import com.improvementApp.workouts.helpers.DriveFilesHelper;
import com.improvementApp.workouts.helpers.ExercisesHelper;
import com.improvementApp.workouts.types.MimeType;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.improvementApp.workouts.helpers.ApplicationVariables.TRAININGS_FOLDER_NAME;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final String TMP_FILES_PATH = ApplicationVariables.TMP_FILES_PATH;
    private static final String EXCEL_EXTENSION = ApplicationVariables.EXCEL_EXTENSION;

    private static final Logger LOGGER = Logger.getLogger(ExerciseController.class);

    private final Drive drive;
    private final ExerciseService exerciseService;

    @Autowired
    public GoogleDriveServiceImpl(ExerciseService exerciseService, Drive drive) {
        this.exerciseService = exerciseService;
        this.drive = drive;
    }

    @Override
    public List<Exercise> saveAllExercisesToDB(final String folderName) throws Exception {
        LOGGER.info("Zapisuje cwiczenia do bazy danych z google drive z folderu: " + folderName);

        final List<DriveFileItemDTO> responseList = getDriveFiles(folderName);

        // TODO: usuwać wszystkie cwiczenia i jeszcze raz dodawać !!!
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
    public void initApplicationCategories() throws Exception {
        final String folderName = ApplicationVariables.CATEGORIES_FOLDER_NAME;
        final List<DriveFileItemDTO> responseList = getDriveFiles(folderName);

        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            downloadFile(driveFileItemDTO);

            final String fileName = TMP_FILES_PATH + driveFileItemDTO.getName() + EXCEL_EXTENSION;
            final java.io.File file = new java.io.File(fileName);

            final List<String> values = DriveFilesHelper.parseExcelSimpleFile(file);
            saveDataToDatabase(values, fileName);
        }
    }

    @Override
    public void initApplicationExercises() throws Exception {
        exerciseService.deleteAllExercises();
        saveAllExercisesToDB(TRAININGS_FOLDER_NAME);
    }

    @Override
    public List<DriveFileItemDTO> getDriveFiles(final String folderName) throws Exception {
        final String folderId = getFolderId(folderName);
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

    private String getFolderId(final String folderName) throws Exception {
        final String query = "mimeType='" + MimeType.DRIVE_FOLDER.getType()
                + "' and name contains '" + folderName + "' ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new Exception("Return more than one folder");

        final List<DriveFileItemDTO> responseList = allFiles.stream()
                .map(DriveFileItemDTO::new)
                .collect(Collectors.toList());

        return responseList.get(0).getId();
    }

    private List<File> getAllFiles(final Drive.Files.List request) {
        List<File> result = new ArrayList<>();
        do {
            try {
                FileList files = request.execute();

                result.addAll(files.getFiles());
                request.setPageToken(files.getNextPageToken());
            } catch (IOException e) {
                System.out.println("An error occurred: " + e);
                request.setPageToken(null);
            }
        } while (request.getPageToken() != null &&
                request.getPageToken().length() > 0);

        return result;
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

    public void downloadFile(final DriveFileItemDTO file) throws IOException {
        final String fileName = TMP_FILES_PATH + file.getName() + EXCEL_EXTENSION;
        drive.files().export(file.getId(), MimeType.EXCEL.getType())
                .executeMediaAndDownloadTo(new FileOutputStream(fileName));
    }

    public void uploadFileInFolder(final String folderName,
                                   final java.io.File fileToUpload,
                                   final String fileName) throws Exception {
        LOGGER.info("Przesylam na google drive plik: " + fileName);

        final String folderId = getFolderId(folderName);

        final File file = new File();
        file.setName(fileName);
        file.setMimeType(MimeType.DRIVE_SHEETS.getType());
        file.setParents(Arrays.asList(folderId));

        final FileContent content = new FileContent(MimeType.EXCEL_DOWNLOAD.getType(), fileToUpload);
        drive.files().create(file, content).setFields("id").execute();
    }

    @Override
    public String generateFileName(List<Exercise> lastExerciseThatType) {
        LOGGER.info("Tworze nazwe pliku dla cwiczen: " + lastExerciseThatType);

        List<Exercise> exercises = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(exercises);

        final String lastExerciseName = exercises.get(0).getTrainingName();
        final String lastTrainingNumber = parseTrainingName(lastExerciseName, 1);
        final int lastExercise = Integer.parseInt(lastTrainingNumber);
        final String incrementedLastExerciseNumber = String.valueOf(lastExercise + 1);

        final String dateString = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

        final String lastTypeExercise = lastExerciseThatType.get(0).getTrainingName();
        final String lastTrainingType = parseTrainingName(lastTypeExercise, 3);

        return incrementedLastExerciseNumber + " - " + dateString + "r." + " - " + lastTrainingType;
    }

    private String parseTrainingName(String trainingName, int groupIndex) {
        final String regex = "([0-9.?[0-9]*]+) - " +
                "([0-9]+.[0-9]+.[0-9]+r.) - " +
                "([A-Z])";
        final Pattern pattern = Pattern.compile(regex);
        final Matcher matcher = pattern.matcher(trainingName);
        final boolean isMatchFound = matcher.find();

        if (!isMatchFound)
            throw new RuntimeException("Incorrect training name: " + trainingName);

        return matcher.group(groupIndex);
    }

}