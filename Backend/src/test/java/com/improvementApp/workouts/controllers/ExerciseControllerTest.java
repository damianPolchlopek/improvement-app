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

//    @Mock
//    GoogleDriveServiceImpl googleDriveService;

    @InjectMocks
    ExerciseController exerciseController;

    @BeforeEach
    public void init(){
        Mockito.lenient().when(exerciseService.findAll()).thenReturn(generateTwoTrainings());
        Mockito.lenient().when(exerciseService.getAllTrainingNames()).thenReturn(generateTwoTrainingsNames());
        Mockito.lenient().when(exerciseService.findByTrainingName(any())).thenReturn(expectedLastTrainingWithType());
        Mockito.lenient().when(exerciseService.findByDate(any())).thenReturn(generateTrainingWithTheSameDate());
        Mockito.lenient().when(exerciseService.findByName(any())).thenReturn(generateTrainingWithTheSameName());
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

    private List<Exercise> generateTrainingWithTheSameDate() {
        return Arrays.asList(exercise1, exercise2, exercise3);
    }

    private List<Exercise> generateTrainingWithTheSameName() {
        return Arrays.asList(exercise1, exercise4);
    }


    @Test
    void test_save_training() {
        // samo przeslanie danych, nie trzeba testu
    }

    @Test
    void test_save_exercise() {
        // samo przeslanie danych, nie trzeba testu
    }

    @Test
    void should_get_last_training_with_type() {

        //when
        List<Exercise> sortedExercises = expectedLastTrainingWithType();
        List<Exercise> controllerResult = (List<Exercise>) exerciseController.getLastTrainingWithType("Hipertroficzny").getEntity();

        //then
        Assert.assertEquals(sortedExercises, controllerResult);
    }

    private List<Exercise> expectedLastTrainingWithType(){
        return new ArrayList<>(Arrays.asList(exercise6, exercise5, exercise4));
    }

    @Test
    void should_get_exercises() {

        //when
        List<Exercise> sortedExercises = sortedTwoTrainings();
        List<Exercise> controllerResult = (List<Exercise>) exerciseController.getExercises().getEntity();

        //then
        Assert.assertEquals(sortedExercises, controllerResult);
    }

    private List<Exercise> sortedTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise6, exercise5, exercise4, exercise3, exercise2, exercise1));
    }

    @Test
    void should_get_exercises_by_date() {
        //when
        List<Exercise> sortedExercises = expectedTrainingWithTheSameDate();
        List<Exercise> controllerResult = (List<Exercise>) exerciseController.getExercisesByDate("2021-09-21").getEntity();

        //then
        Assert.assertEquals(sortedExercises, controllerResult);
    }

    private List<Exercise> expectedTrainingWithTheSameDate() {
        return Arrays.asList(exercise3, exercise2, exercise1);
    }

    @Test
    void should_get_exercises_by_name() {
        //when
        List<Exercise> sortedExercises = expectedTrainingWithTheSameName();
        List<Exercise> controllerResult = (List<Exercise>) exerciseController.getExercisesByName("exerciseName1").getEntity();

        //then
        Assert.assertEquals(sortedExercises, controllerResult);
    }

    private List<Exercise> expectedTrainingWithTheSameName(){
        return Arrays.asList(exercise4, exercise1);
    }

    @Test
    void should_delete_exercise() {
        // samo przeslanie danych, nie trzeba testu
    }
}