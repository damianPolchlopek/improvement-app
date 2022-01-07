package com.improvementApp.workouts.controllers;

import com.improvementApp.workouts.DataForTests;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.services.ExerciseServiceImpl;
import org.junit.Assert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
@RunWith(MockitoJUnitRunner.class)
class ExerciseControllerTest {
    final Exercise exercise1 = DataForTests.generateFirstExerciseFirstTraining();
    final Exercise exercise2 = DataForTests.generateSecondExerciseFirstTraining();
    final Exercise exercise3 = DataForTests.generateThirdExerciseFirstTraining();

    final Exercise exercise4 = DataForTests.generateFirstExerciseSecondTraining();
    final Exercise exercise5 = DataForTests.generateSecondExerciseSecondTraining();
    final Exercise exercise6 = DataForTests.generateThirdExerciseSecondTraining();

    @Mock
    ExerciseServiceImpl exerciseService;

    @InjectMocks
    ExerciseController exerciseController;

    @BeforeEach
    public void init(){
        Mockito.lenient().when(exerciseService.findAll()).thenReturn(generateTwoTrainings());
        Mockito.lenient().when(exerciseService.getAllTrainingNames()).thenReturn(generateTwoTrainingsNames());
        Mockito.lenient().when(exerciseService.findByTrainingName(any())).thenReturn(expectedLastTrainingWithType());
    }

    @Test
    void should_add_training() {
        // TODO: dopisac test
    }

    @Test
    void should_add_exercise() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_last_training_with_type() {
        //when
        List<Exercise> sortedExercises = expectedLastTrainingWithType();
        List<Exercise> controllerResult =
                (List<Exercise>) exerciseController.getLastTrainingWithType("Hipertroficzny").getEntity();

        //then
        Assert.assertEquals(sortedExercises, controllerResult);
    }

    @Test
    void should_get_exercises() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercises_by_date() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercises_by_name() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercises_by_training_name() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_delete_exercise() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_names() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_places() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_progresses() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_types() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_training_names() {
        //when
        List<String> expectedExercisesName = expectedTrainingNames();
        List<String> serviceResult =
                (List<String>) exerciseController.getTrainingNames().getEntity();

        //then
        Assert.assertEquals(expectedExercisesName, serviceResult);
    }

    private List<String> expectedTrainingNames() {
        int firstExerciseIndex = 101;
        String trainingType = "C";
        String trainingDate = "11.11.2011";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        firstExerciseIndex = 102;
        trainingType = "C";
        trainingDate = "18.11.2011";
        String trainingName2 = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new ArrayList<>(Arrays.asList(trainingName2, trainingName));
    }

    private List<Exercise> generateTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4, exercise5, exercise6));
    }

    private List<String> generateTwoTrainingsNames() {
        int firstExerciseIndex = 101;
        String trainingType = "C";
        String trainingDate = "11.11.2011";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        firstExerciseIndex = 102;
        trainingType = "C";
        trainingDate = "18.11.2011";
        String trainingName2 = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new ArrayList<>(Arrays.asList(trainingName, trainingName2));
    }

    private List<Exercise> expectedLastTrainingWithType(){
        return new ArrayList<>(Arrays.asList(exercise6, exercise5, exercise4));
    }
}