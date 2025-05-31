package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.InitializerHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitializationDataService {

    private final InitializerHandler initializerHandler;

    public void initializeData() throws IOException {
        initializerHandler.initializeData();
    }

}
