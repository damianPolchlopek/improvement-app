package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.TrainingNameList;
import com.improvementApp.workouts.helpers.ApplicationVariables;
import com.improvementApp.workouts.helpers.DriveFilesHelper;
import com.improvementApp.workouts.helpers.ExercisesHelper;
import com.improvementApp.workouts.repository.AllTrainingNamesRepository;
import com.improvementApp.workouts.repository.ExerciseRepository;
import com.improvementApp.workouts.services.GoogleDriveService;
import com.improvementApp.workouts.services.GoogleDriveServiceImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ExerciseController {

    private static final Logger LOGGER = Logger.getLogger(ExerciseController.class);

    private final ExerciseRepository exerciseRepository;

    private final AllTrainingNamesRepository allTrainingNamesRepository;

    private final GoogleDriveService googleDriveService;

    @Autowired
    public ExerciseController(ExerciseRepository exerciseRepository,
                              AllTrainingNamesRepository allTrainingNamesRepository,
                              GoogleDriveServiceImpl googleDriveService) {
        this.exerciseRepository = exerciseRepository;
        this.allTrainingNamesRepository = allTrainingNamesRepository;
        this.googleDriveService = googleDriveService;
    }

    @PostMapping("/addTraining")
    public void saveExercise(@RequestBody List<Exercise> exercises) throws Exception {
        LOGGER.info("Dodaje ćwiczenia: " + exercises);

        final String trainingName = googleDriveService.generateFileName(exercises);
        final String trainingNameExcelFile = trainingName + ApplicationVariables.EXCEL_EXTENSION;
        DriveFilesHelper.createExcelFile(exercises, trainingNameExcelFile);

        final File file = new File(ApplicationVariables.TMP_FILES_PATH + trainingNameExcelFile);
        googleDriveService.uploadFileInFolder(ApplicationVariables.GOOGLE_DRIVE_FOLDER, file, trainingName);

        List<Exercise> newExercises = ExercisesHelper.updateExercises(exercises);
        exerciseRepository.saveAll(newExercises);
    }

    @PostMapping("/addExercise")
    public void saveExercise(@RequestBody Exercise exercise) {
        LOGGER.info("Dodaje ćwiczenie: " + exercise.toString());
        exerciseRepository.save(exercise);
    }

    @GetMapping("/getLastTypeTraining/{trainingType}")
    public List<Exercise> getLastTraining(@PathVariable String trainingType) {
        TrainingNameList trainingNameList = allTrainingNamesRepository.findAll().get(0);

        List<String> newTrainingList = trainingNameList.getTrainingNames()
                                    .stream()
                                    .filter(e -> !e.contains("Kopia"))
                                    .sorted(Collections.reverseOrder())
                                    .collect(Collectors.toList());

        trainingNameList.setTrainingNames(newTrainingList);

        String lastSimilarTraining = "-1";
        for (String training: newTrainingList){
            if (training.contains(trainingType)){
                lastSimilarTraining = training;
                break;
            }
        }

        return exerciseRepository.findByTrainingName(lastSimilarTraining + ".xlsx");
    }

    @GetMapping("/getExercises")
    public List<Exercise> getExercise() {
        List<Exercise> result = exerciseRepository.findAll();
        ExercisesHelper.sortExerciseListByDate(result);
        LOGGER.info("Pobieram wszystkie cwiczenia: " + result);
        return result;
    }

    @GetMapping("/getExercise/date/{exerciseDate}")
    public List<Exercise> getExercisesByDate(@PathVariable String exerciseDate) {
        LOGGER.info("Pobieram cwiczenia o dacie: " + exerciseDate);
        List<Exercise> result = exerciseRepository.findByDate(LocalDate.parse(exerciseDate));
        ExercisesHelper.sortExerciseListByDate(result);
        return result;
    }

    @GetMapping("/getExercise/name/{exerciseName}")
    public List<Exercise> getExercisesByName(@PathVariable String exerciseName) {
        LOGGER.info("Pobieram cwiczenia o nazwie: " + exerciseName);
        List<Exercise> result = exerciseRepository.findByName(exerciseName);
        ExercisesHelper.sortExerciseListByDate(result);
        return result;
    }

    @DeleteMapping("/deleteExercise/{exerciseId}")
    public void deleteExercise(@PathVariable String exerciseId) {
        LOGGER.info("Usuwam cwiczenie o id: " + exerciseId);
        exerciseRepository.deleteById(exerciseId);
    }

}
