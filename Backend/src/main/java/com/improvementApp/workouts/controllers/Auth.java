package com.improvementApp.workouts.controllers;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

@Controller
public class Auth {
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE);
    private static final String USER_IDENTIFIER_KEY = "MY_DUMMY_USER";
    private static final String GOOGLE_DRIVE_PROJECT_NAME = "My First Project";
    private static final String TRAININGS_FOLDER_NAME = "PlanMarcela";

    @Value("${google.oauth.callback.uri}")
    private String CALLBACK_URI;

    @Value("${google.secret.key.path}")
    private Resource gdSecretKeys;

    @Value("${google.credentials.folder.path}")
    private Resource credentialsFolder;

    private GoogleAuthorizationCodeFlow flow;

    @PostConstruct
    public void init() throws IOException {
        GoogleClientSecrets secrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(gdSecretKeys.getInputStream()));
        flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY, secrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(credentialsFolder.getFile())).build();
    }

    @GetMapping("/")
    public String showHomePage() throws IOException {
        boolean isUserAuthenticated = false;

        Credential credential = flow.loadCredential(USER_IDENTIFIER_KEY);
        if (credential != null){
            boolean tokenValid = credential.refreshToken();
            if (tokenValid){
                isUserAuthenticated = true;
            }
        }

        return isUserAuthenticated ? "dashboard.html" : "index.html";
    }

    @GetMapping("/googlesignin")
    public void doGoogleSingIn(HttpServletResponse response) throws IOException {
        GoogleAuthorizationCodeRequestUrl url = flow.newAuthorizationUrl();
        String redirectUrl = url.setRedirectUri(CALLBACK_URI).setAccessType("offline").build();
        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/oauth")
    public String saveAuthorizationCode(HttpServletRequest request) throws IOException {
        String code = request.getParameter("code");
        if (code != null){
            saveToken(code);
            return "dashboard.html";
        }

        return "index.html";
    }

    private void saveToken(String code) throws IOException {
        GoogleTokenResponse response = flow.newTokenRequest(code).setRedirectUri(CALLBACK_URI).execute();
        flow.createAndStoreCredential(response, USER_IDENTIFIER_KEY);
    }

    public enum MimeType {

        DRIVE_DOC("application/vnd.google-apps.document"),
        DRIVE_EXCEL("application/vnd.google-apps.spreadsheet"),
        DRIVE_FOLDER("application/vnd.google-apps.folder"),
        EXCEL("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        private String type;

        private MimeType(String fileType) {
            type = fileType;
        }
    }

    @GetMapping(value = {"/testGotowe"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> searchFile2() throws IOException {

        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String folderName = "PlikiPliki";
        MimeType mimeType = MimeType.DRIVE_EXCEL;

        String folderId = getFolderId(folderName);

        final String query = "mimeType='" + mimeType.type + "' and '" + folderId + "' in parents ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);
        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for(File file: allFiles){
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

        List<String> parsedFiles = new ArrayList<>();
        for (DriveFileItemDTO driveFileItemDTO : responseList) {
            downloadFile2(driveFileItemDTO);

            System.out.println("Parsuje: " + driveFileItemDTO.getName());
            String fileName = "src/main/resources/tmp_files/" + driveFileItemDTO.getName() + ".xlsx";
            parsedFiles.add(fileName);
            java.io.File file = new java.io.File(fileName);
            List<Exercise> exercises = DriveFilesHelper.parseExcelFile(file);
            System.out.println(exercises);

            repository.saveAll(exercises);
        }


        return responseList;
    }

    @Autowired
    private ExerciseRepository repository;


    public void downloadFile2(DriveFileItemDTO file) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        drive.files().export(file.getId(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .executeMediaAndDownloadTo(new FileOutputStream("src/main/resources/tmp_files/" + file.getName() + ".xlsx"));
    }












    @GetMapping(value = {"/searchFile"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> searchFile() throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String folderId = getFolderId(TRAININGS_FOLDER_NAME);
        final String query = "mimeType='application/vnd.google-apps.document' and '" + folderId + "' in parents ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);
        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for(File file: allFiles){
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

        return responseList;
    }

    public String getFolderId(final String folderName) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String query = "mimeType='application/vnd.google-apps.folder' and name contains '" + folderName + "' ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);
        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for(File file: allFiles){
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

        return responseList.get(0).getId();
    }

    private List<File> getAllFiles(Drive.Files.List request){
        List<File> result = new ArrayList<File>();
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

    @GetMapping(value = {"/download"}, produces = {"application/json"})
    public @ResponseBody Message downloadFile() throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        String fileId = "1xU2xBsQPqR1jK0Iwkf6GiOG_CklWUnYb9buCk0kmzbo";
        OutputStream outputStream = new ByteArrayOutputStream();
        FileOutputStream fos = new FileOutputStream("sss.xlsx");
        drive.files().export(fileId, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .executeMediaAndDownloadTo(new FileOutputStream("src/main/resources/tmp_files/test.xlsx"));

        System.out.println(outputStream);

        Message message = new Message();
        message.setMessage("Odczytalem plik !!!");
        return message;
    }

    @GetMapping(value = {"/makePublic"}, produces = {"application/json"})
    public @ResponseBody Message makePublic() throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        String fileId = "1laW2p0jORVJojAoe6FyVBFUkDtuVlxrHMt1ycyhdv-c";
        Permission permission = new Permission();
        permission.setType("anyone");
        permission.setRole("reader");
        permission.setExpirationTime(new DateTime("2021-10-31T13:50:09.382Z"));

        drive.permissions().create(fileId, permission).execute();

        Message message = new Message();
        message.setMessage("Dodanop prawa !!!");
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

    @GetMapping(value = {"/listFiles"}, produces = {"application/json"})
    public @ResponseBody
    List<DriveFileItemDTO> listFiles() throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();
        FileList fileList = drive.files().list().setFields("files(id,name,mimeType)").execute();

        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for(File file: fileList.getFiles()){
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

        return responseList;
    }

    @GetMapping(value = "/createFolder/{folderName}", produces = "application/json")
    public @ResponseBody Message createFolder(@PathVariable(name = "folderName") String folder) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        File file = new File();
        file.setName(folder);
        file.setMimeType("application/vnd.google-apps.folder");

        drive.files().create(file).execute();

        Message message = new Message();
        message.setMessage("Folder has been created successfully.");
        return message;
    }

    public class Message {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

}
