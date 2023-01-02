package com.improvement_app.workouts.controllers;

import com.improvement_app.ApplicationVariables;
import com.improvement_app.googledrive.service.GoogleDriveFileService;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercises_fields.Name;
import com.improvement_app.workouts.entity.exercises_fields.Place;
import com.improvement_app.workouts.entity.exercises_fields.Progress;
import com.improvement_app.workouts.entity.exercises_fields.Type;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.services.ExerciseService;
import com.improvement_app.workouts.services.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static com.improvement_app.workouts.TrainingModuleVariables.DRIVE_TRAININGS_FOLDER_NAME;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise")
public class ExerciseController {

    private static final Logger LOGGER = Logger.getLogger(ExerciseController.class);

    private final ExerciseService exerciseService;
    private final GoogleDriveService googleDriveService;
    private final GoogleDriveFileService googleDriveFileService;

    @PostMapping("/addTraining")
    public Response addTraining(@RequestBody List<Exercise> exercises) throws IOException {
        LOGGER.info("Dodaje trening: " + exercises.get(0).getTrainingName());
        LOGGER.info("Dodaje trening z cwiczeniami: " + exercises);

        List<Exercise> exercisesFromDb = exerciseService.findAll();
        ExercisesHelper.sortExerciseListByDate(exercisesFromDb);

        final String trainingName = DriveFilesHelper.generateFileName(exercises, exercisesFromDb.get(0));
        final String trainingNameExcelFile = trainingName + ApplicationVariables.EXCEL_EXTENSION;

        final String excelFileLocation = ApplicationVariables.PATH_TO_EXCEL_FILES + trainingNameExcelFile;
        DriveFilesHelper.createExcelFile(exercises, excelFileLocation);

        final File file = new File(excelFileLocation);
        googleDriveFileService.uploadFileInFolder(DRIVE_TRAININGS_FOLDER_NAME, file, trainingName);

        List<Exercise> newExercises = ExercisesHelper.fillMissingFieldForExercise(exercises, trainingName);
        List<Exercise> savedExercises = exerciseService.saveAll(newExercises);

        return Response.ok(savedExercises).build();
    }

    @DeleteMapping("/deleteTraining/{trainingName}")
    public Response deleteTraining(@PathVariable String trainingName) throws IOException {
        LOGGER.info("Usuwam trening: " + trainingName);
        exerciseService.deleteByTrainingName(trainingName);
        googleDriveService.deleteTraining(trainingName);
        return Response.ok().build();
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
        return Response.ok(result).build();
    }

    @GetMapping("/getExercise/date/{exerciseDate}")
    public Response getExercisesByDate(@PathVariable String exerciseDate) {
        LOGGER.info("Pobieram cwiczenia o dacie: " + exerciseDate);
        List<Exercise> result = exerciseService.findByDate(LocalDate.parse(exerciseDate));
        return Response.ok(result).build();
    }

    @GetMapping("/getExercise/name/{exerciseName}")
    public Response getExercisesByName(@PathVariable String exerciseName) {
        LOGGER.info("Pobieram cwiczenia o nazwie: " + exerciseName);
        List<Exercise> result = exerciseService.findByName(exerciseName);
        return Response.ok(result).build();
    }

    @GetMapping("/getExercise/trainingName/{trainingName}")
    public Response getExercisesByTrainingName(@PathVariable String trainingName) {
        trainingName = trainingName.replace("_", " ");
        LOGGER.info("Pobieram cwiczenia z treningu: " + trainingName);
        List<Exercise> result =  exerciseService.findByTrainingName(trainingName);
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
        LOGGER.info("Poberam nazwy cwiczen");
        List<Name> exerciseNames = exerciseService.getExerciseNames();
        return Response.ok(exerciseNames).build();
    }

    @GetMapping("/getExercisePlaces")
    public Response getExercisePlaces(){
        LOGGER.info("Poberam miejsca cwiczen");
        List<Place> exercisePlaces = exerciseService.getExercisePlaces();
        return Response.ok(exercisePlaces).build();
    }

    @GetMapping("/getExerciseProgresses")
    public Response getExerciseProgresses(){
        LOGGER.info("Poberam progress cwiczen");
        List<Progress> exerciseProgresses = exerciseService.getExerciseProgress();
        return Response.ok(exerciseProgresses).build();
    }

    @GetMapping("/getExerciseTypes")
    public Response getExerciseTypes(){
        LOGGER.info("Poberam typy cwiczen");
        List<Type> exerciseTypes = exerciseService.getExerciseTypes();
        return Response.ok(exerciseTypes).build();
    }

    @GetMapping("/getTrainingNames")
    public Response getTrainingNames(){
        LOGGER.info("Poberam nazwy treningow");
        List<String> trainingNames = exerciseService.getAllTrainingNames();
        return Response.ok(trainingNames).build();
    }

}
