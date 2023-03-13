package com.improvement_app.workouts.services;

import com.improvement_app.workouts.DataForTests;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.repository.ExerciseRepository;
import com.improvement_app.workouts.repository.TypeRepository;
import com.improvement_app.workouts.services.data.ExerciseTypeServiceImpl;
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

    final Type type1 = new Type("Kardio");
    final Type type2 = new Type("Siłowy#1-A");
    final Type type3 = new Type("Hipertroficzny#1-C");

    @Mock
    ExerciseRepository exerciseRepository;

    @Mock
    TypeRepository typeRepository;

    @InjectMocks
    ExerciseServiceImpl exerciseService;


    @InjectMocks
    ExerciseTypeServiceImpl exerciseTypeService;

    @BeforeEach
    public void init(){
        Mockito.lenient().when(exerciseRepository.findAll()).thenReturn(generateTwoTrainings());
        Mockito.lenient().when(exerciseRepository.findByDate(any())).thenReturn(generateTrainingWithTheSameDate());
        Mockito.lenient().when(exerciseRepository.findByNameOrderByDate(any())).thenReturn(generateTrainingWithTheSameName());
        Mockito.lenient().when(exerciseRepository.findByTrainingNameOrderByIndex(any())).thenReturn(generateTrainingWithTheSameDate());
        Mockito.lenient().when(typeRepository.findAll()).thenReturn(generateExerciseTypes());
    }

    private List<Exercise> generateTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4, exercise5, exercise6));
    }

    private List<Exercise> generateTrainingWithTheSameDate() {
        return Arrays.asList(exercise3, exercise2, exercise1);
    }

    private List<Exercise> generateTrainingWithTheSameName() {
        return Arrays.asList(exercise1, exercise4);
    }

    private List<Type> generateExerciseTypes() {
        return Arrays.asList(type1, type2, type3);
    }

    @Test
    void should_find_by_date() {
        //when
        List<Exercise> expectedExercises = expectedTrainingWithTheSameDate();
        List<Exercise> serviceResult = exerciseService.findByDateOrderByIndex(LocalDate.parse("2021-09-21"));

        //then
        Assert.assertEquals(expectedExercises, serviceResult);
    }

    private List<Exercise> expectedTrainingWithTheSameDate() {
        return Arrays.asList(exercise1, exercise2, exercise3);
    }

    @Test
    void should_find_by_name() {
        //when
        List<Exercise> sortedExercises = expectedTrainingWithTheSameName();
        List<Exercise> serviceResult = exerciseService.findByNameReverseSorted("exerciseName1");

        //then
        Assert.assertEquals(sortedExercises, serviceResult);
    }

    private List<Exercise> expectedTrainingWithTheSameName(){
        return Arrays.asList(exercise4, exercise1);
    }

    @Test
    void should_find_by_training_name() {
        //when
        List<Exercise> sortedExercises = expectedTrainingWithTheSameDate();
        List<Exercise> serviceResult = exerciseService.findByTrainingNameOrderByIndex("trainingName");

        //then
        Assert.assertEquals(sortedExercises, serviceResult);
    }

    @Test
    void should_find_all() {
        //when
        List<Exercise> sortedExercises = sortedTwoTrainings();
        List<Exercise> serviceResult =  exerciseService.findAll();

        //then
        Assert.assertEquals(sortedExercises, serviceResult);
    }

    private List<Exercise> sortedTwoTrainings(){
        return new ArrayList<>(Arrays.asList(exercise6, exercise5, exercise4, exercise3, exercise2, exercise1));
    }

    @Test
    void should_get_all_training_names() {
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

        return new ArrayList<>(Arrays.asList(trainingName2, trainingName));
    }

    @Test
    void should_get_exercise_types() {
        List<Type> expectedTypes = expectedExerciseTypes();
        List<Type> serviceResult = exerciseTypeService.getExerciseTypes();

        Assert.assertEquals(expectedTypes, serviceResult);
    }

    private List<Type> expectedExerciseTypes() {
        return List.of(type2, type1, type3);
    }

}