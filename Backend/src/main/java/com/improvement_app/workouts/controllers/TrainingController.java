package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.services.TrainingService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public Response addTraining(@RequestBody List<Exercise> exercises) throws IOException {
        log.info("Dodaje trening: " + exercises.get(0).getTrainingName());
        List<Exercise> addedTraining = trainingService.addTraining(exercises);
        return Response.ok(addedTraining).build();
    }

//    //TODO: currently not used on frontend
//    @DeleteMapping(value = "/{trainingName}", produces = MediaType.APPLICATION_JSON)
//    public Response deleteTraining(@PathVariable String trainingName) throws IOException {
//        log.info("Usuwam trening: " + trainingName);
//
//        exerciseService.deleteByTrainingName(trainingName);
//        googleDriveService.deleteTraining(trainingName);
//        return Response.ok().build();
//    }

}
