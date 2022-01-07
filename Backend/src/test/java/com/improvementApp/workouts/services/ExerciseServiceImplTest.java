package com.improvementApp.workouts.services;

import com.improvementApp.workouts.DataForTests;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.repository.ExerciseRepository;
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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
@RunWith(MockitoJUnitRunner.class)
class ExerciseServiceImplTest {

    final Exercise exercise1 = DataForTests.generateFirstExerciseFirstTraining();
    final Exercise exercise2 = DataForTests.generateSecondExerciseFirstTraining();
    final Exercise exercise3 = DataForTests.generateThirdExerciseFirstTraining();

    final Exercise exercise4 = DataForTests.generateFirstExerciseSecondTraining();
    final Exercise exercise5 = DataForTests.generateSecondExerciseSecondTraining();
    final Exercise exercise6 = DataForTests.generateThirdExerciseSecondTraining();

    @Mock
    ExerciseRepository exerciseRepository;

    @InjectMocks
    ExerciseServiceImpl exerciseService;

    @BeforeEach
    public void init(){
        Mockito.lenient().when(exerciseRepository.findAll()).thenReturn(generateTwoTrainings());
        Mockito.lenient().when(exerciseRepository.findByDate(any())).thenReturn(generateTrainingWithTheSameDate());
        Mockito.lenient().when(exerciseRepository.findByName(any())).thenReturn(generateTrainingWithTheSameName());
    }

    @Test
    void should_find_by_date() {
        //when
        List<Exercise> sortedExercises = expectedTrainingWithTheSameDate();
        List<Exercise> serviceResult = exerciseService.findByDate(LocalDate.parse("2021-09-21"));

        //then
        Assert.assertEquals(sortedExercises, serviceResult);
    }

    @Test
    void should_find_by_name() {
        //when
        List<Exercise> sortedExercises = expectedTrainingWithTheSameName();
        List<Exercise> serviceResult = exerciseService.findByName("exerciseName1");

        //then
        Assert.assertEquals(sortedExercises, serviceResult);
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
        //when
        List<Exercise> sortedExercises = sortedTwoTrainings();
        List<Exercise> serviceResult =  exerciseService.findAll();

        //then
        Assert.assertEquals(sortedExercises, serviceResult);
    }

    @Test
    void should_delete_by_id() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_all_training_names() {
        //when
        List<String> expectedExercisesName = expectedLastTrainingWithType();
        List<String> serviceResult = exerciseService.getAllTrainingNames();

        //then
        Assert.assertEquals(expectedExercisesName, serviceResult);
    }

    @Test
    void should_get_exercise_names() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_save_all_exercise_names() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_delete_all_exercise_names() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_places() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_save_all_exercise_places() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_delete_all_exercise_places() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_progress() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_save_all_exercise_progresses() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_delete_all_exercise_progresses() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_get_exercise_types() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_save_all_exercise_types() {
        // test is not necessary.
        // function transmits data
    }

    @Test
    void should_delete_all_exercise_types() {
        // test is not necessary.
        // function transmits data
    }

    private List<Exercise> expectedTrainingWithTheSameDate() {
        return Arrays.asList(exercise3, exercise2, exercise1);
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

    private List<Exercise> generateTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4, exercise5, exercise6));
    }

    private List<Exercise> generateTrainingWithTheSameDate() {
        return Arrays.asList(exercise1, exercise2, exercise3);
    }

    private List<Exercise> generateTrainingWithTheSameName() {
        return Arrays.asList(exercise1, exercise4);
    }

    private List<Exercise> expectedTrainingWithTheSameName(){
        return Arrays.asList(exercise4, exercise1);
    }

    private List<Exercise> sortedTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise6, exercise5, exercise4, exercise3, exercise2, exercise1));
    }
}