package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.services.TrainingService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/training")
public class TrainingController {

    private final TrainingService trainingService;

    @ApiOperation("Get last training template")
    @GetMapping(value = "/lastTrainingFromTemplate/{trainingType}", produces = MediaType.APPLICATION_JSON)
    public Response getTrainingFromTemplate(@PathVariable String trainingType) {
        log.info("Pobieram ostatnie cwiczenia z szablonu: " + trainingType);
        List<Exercise> exercises = trainingService.generateTrainingFromTemplate(trainingType);
        return Response.ok(exercises).build();
    }

    @ApiOperation("Add new training")
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<Exercise>> addTraining(@RequestBody List<Exercise> exercises) throws IOException {
        List<Exercise> addedTraining = trainingService.addTraining(exercises);
        log.info("Dodaje trening: " + addedTraining.get(0).getTrainingName());
        return ResponseEntity.ok(addedTraining);
    }

}
