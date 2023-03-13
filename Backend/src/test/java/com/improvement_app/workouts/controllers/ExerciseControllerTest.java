package com.improvement_app.workouts.controllers;

import com.improvement_app.workouts.DataForTests;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.services.ExerciseServiceImpl;
import org.junit.Assert;
import org.junit.jupiter.api.BeforeEach;
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

    final Exercise exercise4 = DataForTests.generateFirstExerciseSecondTraining();
    final Exercise exercise5 = DataForTests.generateSecondExerciseSecondTraining();
    final Exercise exercise6 = DataForTests.generateThirdExerciseSecondTraining();

    @Mock
    ExerciseServiceImpl exerciseService;

    @InjectMocks
    ExerciseController exerciseController;

    @BeforeEach
    public void init(){
        Mockito.lenient().when(exerciseService.getAllTrainingNames()).thenReturn(generateTwoTrainingsNames());
        Mockito.lenient().when(exerciseService.findByTrainingNameOrderByIndex(any())).thenReturn(expectedLastTrainingWithType());
    }

//    @Test
    void should_get_last_training_with_type() {
        List<Exercise> sortedExercises = expectedLastTrainingWithType();
        List<Exercise> controllerResult =
                (List<Exercise>) exerciseController.getLastTrainingWithType("Hipertroficzny").getEntity();

        //then
        Assert.assertEquals(sortedExercises, controllerResult);
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