package com.improvementApp.workouts.services;

import com.improvementApp.workouts.DataForTests;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.repository.ExerciseRepository;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@RunWith(MockitoJUnitRunner.class)
class ExerciseServiceImplTest {

    final Exercise exercise1 = DataForTests.generateFirstExerciseFirstTraining();
    final Exercise exercise2 = DataForTests.generateSecondExerciseFirstTraining();
    final Exercise exercise3 = DataForTests.generateThirdExerciseFirstTraining();

    final Exercise exercise4 = DataForTests.generateFirstExerciseSecondTraining();
    final Exercise exercise5 = DataForTests.generateSecondExerciseSecondTraining();
    final Exercise exercise6 = DataForTests.generateThirdExerciseSecondTraining();

    private List<Exercise> generateTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4, exercise5, exercise6));
    }

    @Mock
    ExerciseRepository exerciseRepository;

    @InjectMocks
    ExerciseServiceImpl exerciseService;

    @Test
    void should_get_all_training_names() {
        //given
        when(exerciseRepository.findAll()).thenReturn(generateTwoTrainings());

        //when
        List<String> expectedExercisesName = expectedLastTrainingWithType();
        List<String> serviceResult = exerciseService.getAllTrainingNames();

        //then
        Assert.assertEquals(expectedExercisesName, serviceResult);

    }

    private List<String> expectedLastTrainingWithType() {
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

    @Test
    void should_find_by_date() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_find_by_name() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_find_by_training_name() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_save_all() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_save() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_find_all() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_delete_by_id() {
        // test is not necessary.
        // function transmits data
    }
}