package com.improvement_app.food.ui;

import com.improvement_app.food.application.InitializationDataService;
import com.improvement_app.food.application.ports.in.InitializationUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/drive")
public class GoogleDriveFoodController {

    private final InitializationUseCase initializationUseCase;

    @GetMapping("/initFoodModule")
    public void initProducts() throws IOException {
        log.info("Usuwam i dodaje nowe produkty i posiłki");
        initializationUseCase.initializeData();
    }

}
