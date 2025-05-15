package com.improvement_app.parser.controller;

import com.improvement_app.parser.service.TechnologyService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;


@RestController
@RequiredArgsConstructor
//@EnableScheduling
public class TechnologyController {

    private final TechnologyService technologyService;

    @GetMapping("/technology")
//    @Scheduled(cron = "0 0 20 * * ?") // Uruchamia się codziennie o 4:00 rano
    private void addNewJavaOffer() throws IOException {
        System.out.println("[DPO] Uruchomilem sie");
        technologyService.parseAllJobOffers();
    }

}
