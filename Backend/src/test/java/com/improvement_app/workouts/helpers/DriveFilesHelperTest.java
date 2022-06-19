package com.improvement_app.workouts.helpers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.CardioExercise;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.ExerciseStrategy;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.HypertrophicExercise;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.StrengthExercise;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class DriveFilesHelperTest {

    File file = new File("src/main/resources/tmp_test_dir/255 - 09.10.2021r. - A.xlsx");
    File simpleFile = new File("src/main/resources/tmp_test_dir/ExerciseProgresses.xlsx");

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
        final LocalDate date = LocalDate.of(2021, 10,9);
        final String trainingName = "255 - 09.10.2021r. - A";

        String name = "Wyciskanie sztangi na ławce poziomej - rampa";
        String reps = "5/5/5/3/4";
        String weight = "30/35/40/45/45";
        int index = 0;
        ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise1 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName, index);

        name = "Wyciskanie żołnierskie";
        reps = "5/5/5/5/5";
        weight = "20/20/20/25/25";
        index = 1;
        exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise2 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName, index);

        name = "Prostowanie ramion z drążkiem z użyciem wyc górnego";
        reps = "5/5/5/5/5";
        weight = "34/34/34/34/34";
        index = 2;
        exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise3 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName, index);

        name = "Uginanie ramion ze sztangą";
        reps = "5/5/5/5/5";
        weight = "22.5/22.5/22.5/22.5/22.5";
        index = 3;
        exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(exerciseType, reps, weight);
        repAndWeightList = exerciseStrategy.parseExercise();

        Exercise exercise4 = new Exercise(exerciseType, exercisePlace, name,
                repAndWeightList, progress, date, reps, weight, trainingName, index);

        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4));
    }

    @Test
    void should_parse_excel_simple_file() throws IOException {
        List<String> expectedProgresses = List.of("Zostawić", "Zwiększyć");

        Assert.assertEquals(expectedProgresses, DriveFilesHelper.parseExcelSimpleFile(simpleFile));
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
    void should_get_training_name() {
        //given
        final String expectedName = "255 - 09.10.2021r. - A";

        //when

        //then
        Assert.assertEquals(expectedName, DriveFilesHelper.getTrainingName(file.getName()));
    }

    @Test
    void should_generate_file_name() {
        //given
        final String dateString = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        final String expectedName = "255 - " + dateString + "r. - A";

        List<Exercise> training = generateExpectedTraining();
        Exercise lastExercise = new Exercise();
        lastExercise.setTrainingName("254 - 08.10.2021r. - A.xlsx");
        //when

        //then
        Assert.assertEquals(expectedName, DriveFilesHelper.generateFileName(training, lastExercise));
    }

    @Test
    void should_create_excel_file() throws IOException {
        //TODO: test do napisania
//        final String fileName = "newFile" + ApplicationVariables.EXCEL_EXTENSION;
//        final String fileLocation = ApplicationVariables.pathToExcelsFiles + fileName;
//        List<Exercise> newTraining = generateExpectedTraining();
//        DriveFilesHelper.createExcelFile(newTraining, fileName);
//
//        InputStream expectedFile = new FileInputStream(file.getAbsolutePath());
//        System.out.println(expectedFile.read());
//
//
//        InputStream actualFile = new FileInputStream(fileLocation);
//        System.out.println(actualFile.read());
//
//
//        compareExcelFiles(expectedFile, actualFile);

    }

//    private void compareExcelFiles(InputStream expected, InputStream actual)
//            throws IOException, DataSetException {
//        try {
//            Assert.assertEquals(new XlsDataSet(expected), new XlsDataSet(actual));
//        }
//        finally {
//            IOUtils.closeQuietly(expected);
//            IOUtils.closeQuietly(actual);
//        }
//    }

}