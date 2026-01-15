package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.services.InitializationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    private final InitializationService initializationService;

    @GetMapping(value = "/initApplication", produces = MediaType.APPLICATION_JSON)
    public void initApplication(@AuthenticationPrincipal(expression = "id") Long userId) {
        initializationService.initApplicationTemplates();
        initializationService.initApplicationTrainings(userId);
    }

}
