package com.improvement_app.workouts.configuration;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Auto-configuration for {@link Drive}. */
@Configuration
public class GoogleDriveConfig {
    private final GoogleCredential googleCredential;
    private final NetHttpTransport netHttpTransport;
    private final JacksonFactory jacksonFactory;

    @Autowired
    public GoogleDriveConfig(
            GoogleCredential googleCredential,
            NetHttpTransport netHttpTransport,
            JacksonFactory jacksonFactory) {
        this.googleCredential = googleCredential;
        this.netHttpTransport = netHttpTransport;
        this.jacksonFactory = jacksonFactory;
    }

    @Bean
    public Drive googleDrive() {
        return new Drive(netHttpTransport, jacksonFactory, googleCredential);
    }
}
