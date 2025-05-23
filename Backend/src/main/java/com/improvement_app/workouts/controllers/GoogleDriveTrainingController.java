package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.services.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.ws.rs.core.MediaType;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/drive")
public class GoogleDriveTrainingController {

    private final GoogleDriveService googleDriveService;

    @Transactional
    @GetMapping(value = "/initApplication", produces = MediaType.APPLICATION_JSON)
    public void initApplication() {
        log.info("Usuwam i dodaje nowe dane do bazy danych treningowej");
        googleDriveService.initApplicationCategories();
        googleDriveService.initApplicationExercises();
        googleDriveService.initApplicationTrainingTemplates();
    }

}
