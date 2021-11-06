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
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.DriveFilesHelper;
import com.improvementApp.workouts.repository.ExerciseRepository;
import com.improvementApp.workouts.types.Message;
import com.improvementApp.workouts.types.MimeType;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE);
    private static final String USER_IDENTIFIER_KEY = "MY_DUMMY_USER";
    private static final String GOOGLE_DRIVE_PROJECT_NAME = "My First Project";
    private static final String TMP_FILES_PATH = "src/main/resources/tmp_files/";
    private static final String EXCEL_EXTENSION = ".xlsx";

    @Value("${google.oauth.callback.uri}")
    private String CALLBACK_URI;

    @Value("${google.secret.key.path}")
    private Resource gdSecretKeys;

    @Value("${google.credentials.folder.path}")
    private Resource credentialsFolder;

    private GoogleAuthorizationCodeFlow flow;

    private final ExerciseRepository repository;

    @Autowired
    public GoogleDriveServiceImpl(ExerciseRepository repository) {
        this.repository = repository;
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
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String folderId = getFolderId(folderName);
        final String query = "mimeType='" + MimeType.DRIVE_EXCEL.getType() + "' and '" + folderId + "' in parents ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);
        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for (File file : allFiles) {
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
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
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

        System.out.println("Folder List: " + responseList.size());
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
        final Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final MimeType mimeType = MimeType.DRIVE_EXCEL;
        final String folderId = getFolderId(folderName);
        final String query = "mimeType='" + mimeType.getType() + "' and '" + folderId + "' in parents ";

        final Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);
        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for (File file : allFiles) {
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

        List<Exercise> exercises = new ArrayList<>();
        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            downloadFile(driveFileItemDTO);

            System.out.println("Parsuje: " + driveFileItemDTO.getName());
            String fileName = TMP_FILES_PATH + driveFileItemDTO.getName() + EXCEL_EXTENSION;
            java.io.File file = new java.io.File(fileName);
            exercises.addAll(DriveFilesHelper.parseExcelFile(file));
            System.out.println(exercises);

            repository.saveAll(exercises);
        }

        return exercises;
    }

    public void downloadFile(final DriveFileItemDTO file) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        drive.files().export(file.getId(), MimeType.EXCEL.getType())
                .executeMediaAndDownloadTo(new FileOutputStream(TMP_FILES_PATH + file.getName() + EXCEL_EXTENSION));
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