package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.repository.ExerciseRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ExerciseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExerciseController.class);

    @Autowired
    private ExerciseRepository repository;

    @PostMapping("/addTrainingSchema")
    public void saveExercise(@RequestBody List<Exercise> exercises){
        LOGGER.info("Dodaje ćwiczenia: " + exercises);
        repository.saveAll(exercises);
    }

    @PostMapping("/addExercise")
    public void saveExercise(@RequestBody Exercise exercise){
        LOGGER.info("Dodaje ćwiczenie: " + exercise.toString());
        repository.save(exercise);
    }

    @GetMapping("/getExercises")
    public List<Exercise> getExercise(){
        List<Exercise> result = repository.findAll();
        LOGGER.info("Pobieram wszystkie cwiczenia: " + result);
        return result;
    }

    @DeleteMapping("/deleteExercise/{exerciseId}")
    public void deleteExercise(@PathVariable String exerciseId){
        LOGGER.info("Usuwam cwiczenie o id: " + exerciseId);
        repository.deleteById(exerciseId);
    }
    

}
