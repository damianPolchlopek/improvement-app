package com.improvementApp.workouts.helpers;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.ExerciseStrategy;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class ExercisesHelperTest {

//    public Exercise(String exerciseType, String exercisePlace, String name, List<RepAndWeight> repAndWeightList,
//                    String progress, LocalDate date, String reps, String weight, String trainingName) {

//    Local date format - 2007-12-03

    final int firstExerciseIndex = 101;
    final String lastTrainingType = "C";
    final String trainingName = firstExerciseIndex + " - 11.11.2011r. - " + lastTrainingType;
    final String exerciseType = "Hipertroficzny";
    Exercise exercise1 = new Exercise(exerciseType, "testPlace", "testName1",
        null, "testProgress", LocalDate.parse("2021-11-05"), "1/1/1/1", "2/2/2/2",
            trainingName);
    Exercise exercise2 = new Exercise("testType", "testPlace", "testName2",
            null, "testProgress", LocalDate.parse("2021-11-06"), "testReps", "testWeight",
            "102 - 12.11.2011r. - A");
    Exercise incorrectExerciseName = new Exercise("testType", "testPlace", "testName3",
            null, "testProgress", LocalDate.parse("2021-11-07"), "testReps", "testWeight",
            "Kopia 101 - 11.11.2011r. - A");

    @Test
    void should_filter_exercise_list() {
        //given
        List<Exercise> listBefore = Arrays.asList(exercise1, exercise2, incorrectExerciseName);
        List<Exercise> listAfter = Arrays.asList(exercise1, exercise2);

        //when

        //then
        Assert.assertEquals(listAfter, ExercisesHelper.filterExerciseList(listBefore));
    }

    @Test
    void should_filter_and_sort_exercise_name_list() {
        //given
        final String ex1 = "101 - 11.11.2011r. - A";
        final String ex2 = "102 - 12.11.2011r. - A";
        final String incorrectEx = "Kopia 101 - 11.11.2011r. - A";
        final List<String> listBefore = Arrays.asList(ex1, ex2, incorrectEx);
        final List<String> listAfter = Arrays.asList(ex2, ex1);

        //when

        //then
        Assert.assertEquals(listAfter, ExercisesHelper.filterAndSortExerciseNameList(listBefore));
    }

    @Test
    void should_sort_exercise_list_by_date() {
        //given
        List<Exercise> listBefore = Arrays.asList(exercise1, exercise2, incorrectExerciseName);
        List<Exercise> listAfter = Arrays.asList(incorrectExerciseName, exercise2, exercise1);

        //when

        //then
        ExercisesHelper.sortExerciseListByDate(listBefore);
        Assert.assertEquals(listAfter, listBefore);
    }

    @Test
    void should_update_exercises() {
        //given
        Exercise expectedExercise = createExpectedExercise();
        List<Exercise> listBefore = Arrays.asList(exercise1);
        List<Exercise> listAfter = new ArrayList<>(Arrays.asList(expectedExercise));

        //when

        //then
        Assert.assertEquals(listAfter, ExercisesHelper.updateExercises(listBefore, generateTrainingName()));
    }

    private Exercise createExpectedExercise(){
        final ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(
                exercise1.getType(), exercise1.getReps(), exercise1.getWeight());
        final List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

        final LocalDate date = LocalDate.now();
        final String trainingName = generateTrainingName();

        return new Exercise(exerciseType, "testPlace", "testName1",
                repAndWeightList, "testProgress", date, "1/1/1/1", "2/2/2/2",
                trainingName);
    }

    private String generateTrainingName(){
        final String incrementedLastExerciseNumber = String.valueOf(firstExerciseIndex + 1);
        final LocalDate date = LocalDate.now();
        final String dateString = date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        return  incrementedLastExerciseNumber + " - " + dateString + "r." + " - " + lastTrainingType;
    }


}