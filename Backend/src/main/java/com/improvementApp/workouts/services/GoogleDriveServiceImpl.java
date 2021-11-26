package com.improvementApp.workouts.services;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.controllers.ExerciseController;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.ApplicationVariables;
import com.improvementApp.workouts.helpers.DriveFilesHelper;
import com.improvementApp.workouts.helpers.ExercisesHelper;
import com.improvementApp.workouts.types.MimeType;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final HttpTransport HTTP_TRANSPORT       = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY           = JacksonFactory.getDefaultInstance();
    private static final List<String> SCOPES                = Collections.singletonList(DriveScopes.DRIVE);
    private static final String USER_IDENTIFIER_KEY         = ApplicationVariables.USER_IDENTIFIER_KEY;
    private static final String GOOGLE_DRIVE_PROJECT_NAME   = ApplicationVariables.GOOGLE_DRIVE_PROJECT_NAME;
    private static final String TMP_FILES_PATH              = ApplicationVariables.TMP_FILES_PATH;
    private static final String EXCEL_EXTENSION             = ApplicationVariables.EXCEL_EXTENSION;

    private static final Logger LOGGER = Logger.getLogger(ExerciseController.class);

    @Value("${google.oauth.callback.uri}")
    private String CALLBACK_URI;

    @Value("${google.secret.key.path}")
    private Resource gdSecretKeys;

    @Value("${google.credentials.folder.path}")
    private Resource credentialsFolder;

    private GoogleAuthorizationCodeFlow flow;

    private final ExerciseService exerciseService;

    @Autowired
    public GoogleDriveServiceImpl(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostConstruct
    public void init() throws IOException {
        GoogleClientSecrets secrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(gdSecretKeys.getInputStream()));
        flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY, secrets, SCOPES)
                .setDataStoreFactory(
                        new FileDataStoreFactory(credentialsFolder.getFile()))
                .build();
    }

    @Override
    public List<DriveFileItemDTO> listFiles(final String folderName) throws Exception {
        LOGGER.info("Pobieram pliki z folderu: " + folderName);

        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred)
                .setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String folderId = getFolderId(folderName);
        final String query = "mimeType='" + MimeType.DRIVE_SHEETS.getType() + "' and '" + folderId + "' in parents ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);
        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for (File file : allFiles) {
            DriveFileItemDTO item = new DriveFileItemDTO(file);
            responseList.add(item);
        }

        return responseList;
    }

    private String getFolderId(final String folderName) throws Exception {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred)
                .setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String query = "mimeType='" + MimeType.DRIVE_FOLDER.getType() + "' and name contains '" + folderName + "' ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new Exception("Return more than one folder");

        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for (File file : allFiles) {
            DriveFileItemDTO item = new DriveFileItemDTO(file);
            responseList.add(item);
        }

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

    @Override
    public List<Exercise> saveAllExercisesToDB(final String folderName) throws Exception {
        LOGGER.info("Zapisuje cwiczenia do bazy danych z google drive z folderu: " + folderName);

        final Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        final Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred)
                .setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final MimeType mimeType = MimeType.DRIVE_SHEETS;
        final String folderId = getFolderId(folderName);
        final String query = "mimeType='" + mimeType.getType() + "' and '" + folderId + "' in parents ";

        final Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        final List<File> allFiles = getAllFiles(request);
        final List<DriveFileItemDTO> responseList = new ArrayList<>();
        for (File file : allFiles) {
            DriveFileItemDTO item = new DriveFileItemDTO(file);
            responseList.add(item);
        }

        final List<Exercise> exercises = new ArrayList<>();

        final List<String> trainingsName = exerciseService.getAllTrainingNames();
        for (DriveFileItemDTO driveFileItemDTO : responseList) {

            final String trainingName = driveFileItemDTO.getName() + EXCEL_EXTENSION;

            if(!trainingsName.contains(trainingName)){
                downloadFile(driveFileItemDTO);
                trainingsName.add(trainingName);

                LOGGER.info("Dodaje do bazy danych trening o nazwie: " + trainingName);

                String fileName = TMP_FILES_PATH + trainingName;
                java.io.File file = new java.io.File(fileName);
                exercises.addAll(DriveFilesHelper.parseExcelFile(file));
            } else {
                LOGGER.info("Trening o nazwie: " + trainingName + ", juz istnieje w bazie danych");
            }
        }

        List<Exercise> filterExercise = ExercisesHelper.filterExerciseList(exercises);
        exerciseService.saveAll(filterExercise);

        return exercises;
    }

    public void downloadFile(final DriveFileItemDTO file) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        drive.files().export(file.getId(), MimeType.EXCEL.getType())
                .executeMediaAndDownloadTo(new FileOutputStream(TMP_FILES_PATH + file.getName() + EXCEL_EXTENSION));
    }

    public void uploadFileInFolder(final String folderName,
                                   final java.io.File fileToUpload,
                                   final String fileName) throws Exception {
        LOGGER.info("Przesylam na google drive plik: " + fileName);

        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String folderId = getFolderId(folderName);

        File file = new File();
        file.setName(fileName);
        file.setMimeType(MimeType.DRIVE_SHEETS.getType());
        file.setParents(Arrays.asList(folderId));

        FileContent content = new FileContent(MimeType.EXCEL_DOWNLOAD.getType(), fileToUpload);
        File uploadedFile = drive.files().create(file, content).setFields("id").execute();

//        String fileReference = String.format("{fileID: '%s'}", uploadedFile.getId());
//        response.getWriter().write(fileReference);
    }

    @Override
    public String generateFileName(List<Exercise> lastExerciseThatType) {
        LOGGER.info("Tworze nazwe pliku dla cwiczen: " + lastExerciseThatType);

        List<Exercise> exercises = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(exercises);

        final String lastExerciseName = exercises.get(0).getTrainingName();
        final String lastTrainingNumber = parseTrainingName(lastExerciseName, 1);
        int lastExercise = Integer.parseInt(lastTrainingNumber);

        // TODO: zmienic na inkrementacje
        final String incrementedLastExerciseNumber = String.valueOf(++lastExercise);
        final String dateString = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

        final String lastTypeExercise = lastExerciseThatType.get(0).getTrainingName();
        final String lastTrainingType = parseTrainingName(lastTypeExercise, 3);

        return incrementedLastExerciseNumber + " - " + dateString + "r." + " - " + lastTrainingType;
    }

    private String parseTrainingName(String trainingName, int groupIndex){
        final String regex = "([0-9.?[0-9]*]+) - " +
                        "([0-9]+.[0-9]+.[0-9]+r.) - " +
                        "([A-Z]).xlsx";
        final Pattern pattern       = Pattern.compile(regex);
        final Matcher matcher       = pattern.matcher(trainingName);
        final boolean isMatchFound  = matcher.find();

        if (!isMatchFound)
            throw new RuntimeException("Incorrect training name");

        return matcher.group(groupIndex);
    }

}