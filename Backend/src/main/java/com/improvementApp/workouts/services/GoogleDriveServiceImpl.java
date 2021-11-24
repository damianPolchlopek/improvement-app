package com.improvementApp.workouts.services;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;
import com.improvementApp.workouts.DTO.DriveFileItemDTO;
import com.improvementApp.workouts.controllers.ExerciseController;
import com.improvementApp.workouts.entity.TrainingNameList;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.DriveFilesHelper;
import com.improvementApp.workouts.helpers.ExercisesHelper;
import com.improvementApp.workouts.repository.AllTrainingNamesRepository;
import com.improvementApp.workouts.repository.ExerciseRepository;
import com.improvementApp.workouts.types.Message;
import com.improvementApp.workouts.types.MimeType;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
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

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE);
    private static final String USER_IDENTIFIER_KEY = "MY_DUMMY_USER";
    private static final String GOOGLE_DRIVE_PROJECT_NAME = "My First Project";
    private static final String TMP_FILES_PATH = "src/main/resources/tmp_files/";
    private static final String EXCEL_EXTENSION = ".xlsx";

    private static final Logger LOGGER = Logger.getLogger(ExerciseController.class);

    @Value("${google.oauth.callback.uri}")
    private String CALLBACK_URI;

    @Value("${google.secret.key.path}")
    private Resource gdSecretKeys;

    @Value("${google.credentials.folder.path}")
    private Resource credentialsFolder;

    private GoogleAuthorizationCodeFlow flow;

    private final ExerciseRepository exerciseRepository;

    private final AllTrainingNamesRepository allTrainingNamesRepository;

    @Autowired
    public GoogleDriveServiceImpl(ExerciseRepository exerciseRepository,
                                  AllTrainingNamesRepository allTrainingNamesRepository) {
        this.exerciseRepository = exerciseRepository;
        this.allTrainingNamesRepository = allTrainingNamesRepository;
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

    public String getFolderId(final String folderName) throws Exception {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

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
        //TODO: zmiana przy uzupelnieniu bazy danych
//        final TrainingNameList trainingsName = allTrainingNamesRepository.findAll().get(0);
        final TrainingNameList trainingsName = new TrainingNameList();
        for (DriveFileItemDTO driveFileItemDTO : responseList) {

            final String trainingName = driveFileItemDTO.getName();
            if(!checkIfTrainingExists(trainingsName, trainingName)){
                downloadFile(driveFileItemDTO);

                trainingsName.add(trainingName);
                LOGGER.info("Dodaje do bazy danych trening o nazwie: " + trainingName);

                String fileName = TMP_FILES_PATH + trainingName + EXCEL_EXTENSION;
                java.io.File file = new java.io.File(fileName);
                exercises.addAll(DriveFilesHelper.parseExcelFile(file));
                System.out.println(exercises);
            } else {
                LOGGER.info("Trening o nazwie: " + trainingName + ", juz istnieje w bazie danych");
            }
        }

        List<Exercise> filterExercise = ExercisesHelper.filterExerciseList(exercises);
        exerciseRepository.saveAll(filterExercise);

        allTrainingNamesRepository.deleteAll();
        allTrainingNamesRepository.save(trainingsName);

        return exercises;
    }

    private boolean checkIfTrainingExists(final TrainingNameList trainingNameList, final String trainingName){
        return trainingNameList.getTrainingNames().contains(trainingName);
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

        List<Exercise> exercises = exerciseRepository.findAll();
        ExercisesHelper.sortExerciseListByDate(exercises);
        String lastExerciseName = exercises.get(0).getTrainingName();
        System.out.println(lastExerciseName);


        final String lastTrainingNumber = parseTrainingName(lastExerciseName, 1);

        int lastExercise = Integer.parseInt(lastTrainingNumber);

        // TODO: zmienic na inkrementacje
        String incrementedLastExerciseNumber = String.valueOf(++lastExercise);

        System.out.println("Training to add: " + incrementedLastExerciseNumber);

        String dateString = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        System.out.println(dateString);


        String lastTypeExercise = lastExerciseThatType.get(0).getTrainingName();
        final String lastTrainingType = parseTrainingName(lastTypeExercise, 3);

        String trainingName = incrementedLastExerciseNumber + " - " + dateString + "r." + " - " + lastTrainingType;

        System.out.println(trainingName);

        return trainingName;
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

    /////////////////////////////////////////////////////////////////////////////
    //                           ADDITIONAL METHOD                             //
    /////////////////////////////////////////////////////////////////////////////

    @GetMapping(value = {"/makePublic"}, produces = {"application/json"})
    public @ResponseBody
    Message makePublic() throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        String fileId = "1laW2p0jORVJojAoe6FyVBFUkDtuVlxrHMt1ycyhdv-c";
        Permission permission = new Permission();
        permission.setType("anyone");
        permission.setRole("reader");
        permission.setExpirationTime(new DateTime("2021-10-31T13:50:09.382Z"));

        drive.permissions().create(fileId, permission).execute();

        Message message = new Message();
        message.setMessage("Dodano prawa");
        return message;
    }

    @GetMapping("/create")
    public void createFile(HttpServletResponse response) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        File file = new File();
        file.setName("sample.jpg");

        FileContent content = new FileContent("image/jpeg", new java.io.File("C:\\Users\\damia\\OneDrive\\Pulpit\\mem.jpg"));
        File uploadedFile = drive.files().create(file, content).setFields("id").execute();

        String fileReference = String.format("{fileID: '%s'}", uploadedFile.getId());
        response.getWriter().write(fileReference);
    }

    @GetMapping("/uploadInFolder")
    public void uploadInFolder(HttpServletResponse response) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        File file = new File();
        file.setName("sample.jpg");
        file.setParents(Arrays.asList("1vjpPZJkqYcYVMJccnjb_zoukp_kaur5b"));

        FileContent content = new FileContent("image/jpeg", new java.io.File("C:\\Users\\damia\\OneDrive\\Pulpit\\mem.jpg"));
        File uploadedFile = drive.files().create(file, content).setFields("id").execute();

        String fileReference = String.format("{fileID: '%s'}", uploadedFile.getId());
        response.getWriter().write(fileReference);
    }

    @GetMapping(value = "/createFolder/{folderName}", produces = "application/json")
    public @ResponseBody
    Message createFolder(@PathVariable(name = "folderName") String folder) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        File file = new File();
        file.setName(folder);
        file.setMimeType(MimeType.DRIVE_FOLDER.getType());

        drive.files().create(file).execute();

        Message message = new Message();
        message.setMessage("Folder has been created successfully.");
        return message;
    }

}