package com.improvementApp.workouts.services;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE);
    private static final String USER_IDENTIFIER_KEY = "MY_DUMMY_USER";
    private static final String GOOGLE_DRIVE_PROJECT_NAME = "My First Project";
    private static final String TRAININGS_FOLDER_NAME = "PlikiPliki";
    private static final String EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

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
                .setDataStoreFactory(
                        new FileDataStoreFactory(credentialsFolder.getFile()))
                .build();
    }

    @Override
    public List<DriveFileItemDTO> listFiles(final String folderName) throws Exception {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        System.out.println("-----------" + folderName);
        final String folderId = getFolderId(folderName);
        System.out.println("-----------" + folderId);
//        final String query = "mimeType='application/vnd.google-apps.document' and '" + folderId + "' in parents ";
        final String query = "mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' and '" + folderId + "' in parents ";

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

    public String getFolderId(final String folderName) throws Exception {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        final String query = "mimeType='application/vnd.google-apps.folder' and name contains '" + folderName + "' ";

        Drive.Files.List request = drive
                .files()
                .list()
                .setQ(query);

        List<File> allFiles = getAllFiles(request);

        if (allFiles.size() > 1)
            throw new Exception("Return more than one folder");

        List<DriveFileItemDTO> responseList = new ArrayList<>();
        for(File file: allFiles){
            DriveFileItemDTO item = new DriveFileItemDTO();
            item.setId(file.getId());
            item.setName(file.getName());
            item.setMimeType(file.getMimeType());
            responseList.add(item);
        }

//        System.out.println(responseList.get(0).getName());
        System.out.println("Size: " + responseList.size());
        return responseList.get(0).getId();
    }

    private List<File> getAllFiles(Drive.Files.List request){
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

    public void downloadFile(final String fileId) throws IOException {
        Credential cred = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred).setApplicationName(GOOGLE_DRIVE_PROJECT_NAME).build();

        OutputStream outputStream = new ByteArrayOutputStream();
        drive.files().export(fileId, EXCEL_MIME_TYPE)
                .executeMediaAndDownloadTo(
                        new FileOutputStream("src/main/resources/tmp_files/test.xlsx"));

        System.out.println(outputStream);
    }

}
