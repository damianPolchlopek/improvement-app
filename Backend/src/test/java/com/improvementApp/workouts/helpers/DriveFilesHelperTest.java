package com.improvementApp.workouts.helpers;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.ExerciseStrategy;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.HypertrophicExercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.CardioExercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.StrengthExercise;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class DriveFilesHelperTest {

    File file = new File("src/main/resources/tmp_test_dir/255 - 09.10.2021r. - A.xlsx");

    @Test
    void should_parse_excel_file() throws IOException {
        //given
        List<Exercise> listAfter = generateExpectedTraining();

        //when

        //then
        Assert.assertEquals(listAfter, DriveFilesHelper.parseExcelTrainingFile(file));
    }

    private List<Exercise> generateExpectedTraining(){

        final String exerciseType = "Siłowy#1-A";
        final String exercisePlace = "Siłownia";
        final String progress = "zostawic";
        final LocalDate date = DriveFilesHelper.getLocalDate(file.getName());
        final String trainingName = DriveFilesHelper.getTrainingName(file.getName());

        String name = "Wyciskanie sztangi na ławce poziomej - rampa";
        String reps = "5/5/5/3/4";
        String weight = "30/35/40/45/45";
        ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise1 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName);

        name = "Wyciskanie żołnierskie";
        reps = "5/5/5/5/5";
        weight = "20/20/20/25/25";
        exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise2 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName);

        name = "Prostowanie ramion z drążkiem z użyciem wyc górnego";
        reps = "5/5/5/5/5";
        weight = "34/34/34/34/34";
        exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise3 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName);

        name = "Uginanie ramion ze sztangą";
        reps = "5/5/5/5/5";
        weight = "22.5/22.5/22.5/22.5/22.5";
        exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise4 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName);

        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4));
    }

    @Test
    void should_get_exercise_parse_strategy() {
        final String reps = "-1";
        final String weight = "-1";

        final String HYPERTROPHIED_TRAINING_NAME = "Hipertroficzny";
        ExerciseStrategy strategy = DriveFilesHelper.getExerciseParseStrategy(HYPERTROPHIED_TRAINING_NAME, reps, weight);
        boolean isInstance = strategy instanceof HypertrophicExercise;
        Assert.assertTrue(isInstance);

        final String CARDIO_TRAINING_NAME = "Kardio";
        strategy = DriveFilesHelper.getExerciseParseStrategy(CARDIO_TRAINING_NAME, reps, weight);
        isInstance = strategy instanceof CardioExercise;
        Assert.assertTrue(isInstance);

        final String STRENGTH_TRAINING_NAME = "Siłowy";
        strategy = DriveFilesHelper.getExerciseParseStrategy(STRENGTH_TRAINING_NAME, reps, weight);
        isInstance = strategy instanceof StrengthExercise;
        Assert.assertTrue(isInstance);
    }

    @Test
    void should_get_exercise_parse_strategy_exception() {
        final String reps = "-1";
        final String weight = "-1";
        final String HYPERTROPHIED_TRAINING_NAME = "sswq";

        Assert.assertThrows(RuntimeException.class, () ->
                DriveFilesHelper.getExerciseParseStrategy(HYPERTROPHIED_TRAINING_NAME, reps, weight));
    }

    @Test
    void should_get_local_date() {
        //given
        final LocalDate expectedDate = LocalDate.of(2021, 10, 9);

        //when

        //then
        Assert.assertEquals(expectedDate, DriveFilesHelper.getLocalDate(file.getName()));
    }

    @Test
    void getTrainingName() {
        //TODO: test do napisania
    }

    @Test
    void should_create_excel_file() {
        //TODO: test do napisania
    }

}