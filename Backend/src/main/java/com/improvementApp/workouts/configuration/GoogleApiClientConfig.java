package com.improvementApp.workouts.configuration;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.DriveScopes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class GoogleApiClientConfig {

    private Set<String> googleOAuth2Scopes() {
        Set<String> googleOAuth2Scopes = new HashSet<>();
        googleOAuth2Scopes.add(DriveScopes.DRIVE);
        return Collections.unmodifiableSet(googleOAuth2Scopes);
    }

    @Bean
    public GoogleCredential googleCredential() throws IOException {
        File serviceAccount = new ClassPathResource("serviceAccount.json").getFile();
        FileInputStream fileInputStream = new FileInputStream(serviceAccount);
        return GoogleCredential.fromStream(fileInputStream)
                .createScoped(googleOAuth2Scopes());
    }

    @Bean
    public NetHttpTransport netHttpTransport() throws GeneralSecurityException, IOException {
        return GoogleNetHttpTransport.newTrustedTransport();
    }

    @Bean
    public JacksonFactory jacksonFactory() {
        return JacksonFactory.getDefaultInstance();
    }

}
