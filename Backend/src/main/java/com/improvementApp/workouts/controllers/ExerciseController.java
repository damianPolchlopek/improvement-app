package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.ExercisesFields.Name;
import com.improvementApp.workouts.entity.ExercisesFields.Place;
import com.improvementApp.workouts.entity.ExercisesFields.Progress;
import com.improvementApp.workouts.entity.ExercisesFields.Type;
import com.improvementApp.workouts.helpers.ApplicationVariables;
import com.improvementApp.workouts.helpers.DriveFilesHelper;
import com.improvementApp.workouts.helpers.ExercisesHelper;
import com.improvementApp.workouts.services.ExerciseService;
import com.improvementApp.workouts.services.ExerciseServiceImpl;
import com.improvementApp.workouts.services.GoogleDriveService;
import com.improvementApp.workouts.services.GoogleDriveServiceImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.io.File;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/exercise")
public class ExerciseController {

    private static final Logger LOGGER = Logger.getLogger(ExerciseController.class);

    private final ExerciseService exerciseService;

    private final GoogleDriveService googleDriveService;

    @Autowired
    public ExerciseController(ExerciseServiceImpl exerciseService,
                              GoogleDriveServiceImpl googleDriveService) {
        this.exerciseService = exerciseService;
        this.googleDriveService = googleDriveService;
    }

    @PostMapping("/addTraining")
    public Response saveTraining(@RequestBody List<Exercise> exercises) throws Exception {
        LOGGER.info("Dodaje ćwiczenia: " + exercises);

        final String trainingName = googleDriveService.generateFileName(exercises);
        final String trainingNameExcelFile = trainingName + ApplicationVariables.EXCEL_EXTENSION;
        DriveFilesHelper.createExcelFile(exercises, trainingNameExcelFile);

        final File file = new File(ApplicationVariables.TMP_FILES_PATH + trainingNameExcelFile);
        googleDriveService.uploadFileInFolder(ApplicationVariables.TRAININGS_FOLDER_NAME, file, trainingName);

        List<Exercise> exercisesFromDb = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(exercisesFromDb);

        List<Exercise> newExercises = ExercisesHelper.updateExercises(exercises, trainingName);
        List<Exercise> savedExercises = exerciseService.saveAll(newExercises);

        return Response.ok(savedExercises).build();
    }

    @PostMapping("/addExercise")
    public Response saveExercise(@RequestBody Exercise exercise) {
        LOGGER.info("Dodaje ćwiczenie: " + exercise.toString());
        Exercise savedExercise = exerciseService.save(exercise);
        return Response.ok(savedExercise).build();
    }

    @GetMapping("/getLastTypeTraining/{trainingType}")
    public Response getLastTrainingWithType(@PathVariable String trainingType) {
        LOGGER.info("Pobieram ostatnie cwiczenia o typie: " + trainingType);

        List<String> trainingNameList = exerciseService.getAllTrainingNames();
        List<String> filteredTrainingList = ExercisesHelper.filterAndSortExerciseNameList(trainingNameList);

        String trainingName = filteredTrainingList.stream()
                .filter(name -> name.contains(trainingType))
                .findFirst()
                .orElse("Nie znalazlem treningu");

        List<Exercise> result =  exerciseService.findByTrainingName(trainingName);
        return Response.ok(result).build();
    }

    @GetMapping("/getExercises")
    public Response getExercises() {
        LOGGER.info("Pobieram wszystkie cwiczenia");
        List<Exercise> result = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(result);
        return Response.ok(result).build();
    }

    @GetMapping("/getExercise/date/{exerciseDate}")
    public Response getExercisesByDate(@PathVariable String exerciseDate) {
        LOGGER.info("Pobieram cwiczenia o dacie: " + exerciseDate);
        List<Exercise> result = exerciseService.findByDate(LocalDate.parse(exerciseDate));
        ExercisesHelper.sortExerciseListByDate(result);
        return Response.ok(result).build();
    }

    @GetMapping("/getExercise/name/{exerciseName}")
    public Response getExercisesByName(@PathVariable String exerciseName) {
        LOGGER.info("Pobieram cwiczenia o nazwie: " + exerciseName);
        List<Exercise> result = exerciseService.findByName(exerciseName);
        ExercisesHelper.sortExerciseListByDate(result);
        return Response.ok(result).build();
    }

    @DeleteMapping("/deleteExercise/{exerciseId}")
    public Response deleteExercise(@PathVariable String exerciseId) {
        LOGGER.info("Usuwam cwiczenie o id: " + exerciseId);
        exerciseService.deleteById(exerciseId);
        return Response.ok().build();
    }

    @GetMapping("/getExerciseNames")
    public Response getExerciseNames(){
        List<Name> exerciseNames = exerciseService.getExerciseNames();
        return Response.ok(exerciseNames).build();
    }

    @GetMapping("/getExercisePlaces")
    public Response getExercisePlaces(){
        List<Place> exercisePlaces = exerciseService.getExercisePlaces();
        return Response.ok(exercisePlaces).build();
    }

    @GetMapping("/getExerciseProgresses")
    public Response getExerciseProgresses(){
        List<Progress> exerciseProgresses = exerciseService.getExerciseProgress();
        return Response.ok(exerciseProgresses).build();
    }

    @GetMapping("/getExerciseTypes")
    public Response getExerciseTypes(){
        List<Type> exerciseTypes = exerciseService.getExerciseTypes();
        return Response.ok(exerciseTypes).build();
    }

}
