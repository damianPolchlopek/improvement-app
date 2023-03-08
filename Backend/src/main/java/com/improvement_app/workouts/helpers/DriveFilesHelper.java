package com.improvement_app.workouts.helpers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.exceptions.ExerciseTypeNotFoundException;
import com.improvement_app.workouts.exceptions.TrainingRegexNotFoundException;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.CardioExercise;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.ExerciseStrategy;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.HypertrophicExercise;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.StrengthExercise;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DriveFilesHelper {

    private static final int TRAINING_NUMBER_INDEX = 1;
    private static final int TRAINING_DAY_INDEX    = 2;
    private static final int TRAINING_MONTH_INDEX  = 3;
    private static final int TRAINING_YEAR_INDEX   = 4;
    private static final int TRAINING_TYPE_INDEX   = 5;

    public static List<Exercise> parseExcelTrainingFile(final File file) throws IOException {
        List<Exercise> exerciseList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)){

            XSSFSheet sheet = wb.getSheetAt(0);
            final int EXERCISE_TYPE_INDEX = 0;
            final int EXERCISE_AREA_INDEX = 1;
            final int NAME_INDEX = 2;
            final int SERIES_INDEX = 3;
            final int WEIGHT_INDEX = 4;
            final int PROGRESS_INDEX = 5;

            int exerciseIndex = 0;
            for (final Row row : sheet) {

                if (!checkIfNextRowExists(row))
                    continue;

                Cell cell = row.getCell(EXERCISE_TYPE_INDEX);
                final String exerciseType = cell.getStringCellValue().trim();
                cell = row.getCell(EXERCISE_AREA_INDEX);
                final String exerciseArea = cell.getStringCellValue().trim();
                cell = row.getCell(NAME_INDEX);
                final String exerciseName = cell.getStringCellValue().trim();
                cell = row.getCell(SERIES_INDEX);
                final String reps = cell.getStringCellValue().trim();
                cell = row.getCell(WEIGHT_INDEX);
                final String weight = cell.getStringCellValue().trim();
                cell = row.getCell(PROGRESS_INDEX);
                final String progress = cell.getStringCellValue().trim();
                final LocalDate localDate = getLocalDate(file.getName());
                final String trainingName = getTrainingName(file.getName()).trim();

                final ExerciseStrategy exerciseStrategy = getExerciseParseStrategy(exerciseType, reps, weight);
                final List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

                final Exercise exercise = new Exercise(exerciseType, exerciseArea, exerciseName, repAndWeightList,
                        progress, localDate, reps, weight, trainingName, exerciseIndex);

                exerciseList.add(exercise);
                exerciseIndex++;
            }
        }

        return exerciseList;
    }

    private static boolean checkIfNextRowExists(Row row){
        final int FIRST_CELL_INDEX = 0;
        Cell cell = row.getCell(FIRST_CELL_INDEX);
        if (cell == null)
            return false;

        String exerciseType = cell.getStringCellValue();
        return !exerciseType.isEmpty();
    }

    public static List<String> parseExcelSimpleFile(final File file) throws IOException {
        List<String> dataList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(file);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {

            XSSFSheet sheet = wb.getSheetAt(0);

            for (final Row row : sheet) {
                if (!checkIfNextRowExists(row))
                    continue;

                final int DATA_INDEX = 0;
                Cell cell = row.getCell(DATA_INDEX);
                String data = cell.getStringCellValue();
                dataList.add(data);
            }
        }

        return dataList;
    }

    public static ExerciseStrategy getExerciseParseStrategy(final String exerciseType,
                                                            final String reps,
                                                            final String weight) {
        final String STRENGTH_TRAINING_NAME = "Siłowy";
        final String HYPERTROPHIED_TRAINING_NAME = "Hipertroficzny";
        final String CARDIO_TRAINING_NAME = "Kardio";

        if (exerciseType.contains(STRENGTH_TRAINING_NAME)) {
            return new StrengthExercise(reps, weight);
        } else if (exerciseType.contains(HYPERTROPHIED_TRAINING_NAME)) {
            return new HypertrophicExercise(reps, weight);
        } else if (exerciseType.contains(CARDIO_TRAINING_NAME)) {
            return new CardioExercise(reps, weight);
        } else {
            throw new ExerciseTypeNotFoundException("Unknown training type: " + exerciseType);
        }
    }

    public static LocalDate getLocalDate(final String dateToParse){
        final String day = parseTrainingName(dateToParse, TRAINING_DAY_INDEX);
        final String month = parseTrainingName(dateToParse, TRAINING_MONTH_INDEX);
        final String year = parseTrainingName(dateToParse, TRAINING_YEAR_INDEX);
        final String dateConcatenation = year + "-" + month + "-" + day;

        return LocalDate.parse(dateConcatenation);
    }

    public static String getTrainingName(final String fileName){
        final String number = parseTrainingName(fileName, TRAINING_NUMBER_INDEX);
        final String day = parseTrainingName(fileName, TRAINING_DAY_INDEX);
        final String month = parseTrainingName(fileName, TRAINING_MONTH_INDEX);
        final String year = parseTrainingName(fileName, TRAINING_YEAR_INDEX);
        final String type = parseTrainingName(fileName, TRAINING_TYPE_INDEX);

        return number + " - " + day + "." + month + "." + year + "r. - " + type;
    }

    public static String generateFileName(List<Exercise> exercisesToAdd, Exercise lastExistedExercise) {
        final String lastExerciseName = lastExistedExercise.getTrainingName();
        final String lastTrainingNumber = parseTrainingName(lastExerciseName, 1);
        final int lastExercise = Integer.parseInt(lastTrainingNumber);
        final String incrementedLastExerciseNumber = String.valueOf(lastExercise + 1);

        final String dateString = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

        final String lastTypeExercise = exercisesToAdd.get(0).getTrainingName();
        final String lastTrainingType = parseTrainingName(lastTypeExercise, 5);

        return incrementedLastExerciseNumber + " - " + dateString + "r." + " - " + lastTrainingType;
    }

    private static String parseTrainingName(String trainingName, int groupIndex) {
        final String regex = "([0-9]{3}) - ([0-9]{2}).([0-9]{2}).([0-9]{4})r. - ([A-Z])";

        final Pattern pattern = Pattern.compile(regex);
        final Matcher matcher = pattern.matcher(trainingName);
        final boolean isMatchFound = matcher.find();

        if (!isMatchFound)
            throw new TrainingRegexNotFoundException("Incorrect training name: " + trainingName);

        return matcher.group(groupIndex);
    }

    public static void createExcelFile(final List<Exercise> exercises,
                                       final String fileLocation) throws IOException {

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Arkusz 1");
            sheet.setColumnWidth(0, 6000);
            sheet.setColumnWidth(1, 4000);
            sheet.setColumnWidth(2, 10000);
            sheet.setColumnWidth(3, 6000);
            sheet.setColumnWidth(4, 9000);
            sheet.setColumnWidth(5, 3000);

            XSSFFont font = workbook.createFont();
            font.setFontName("Times New Roman");
            font.setFontHeightInPoints((short) 12);
            CellStyle style = workbook.createCellStyle();
            style.setFont(font);
            style.setWrapText(true);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);

            for (int i = 0; i < exercises.size(); ++i) {
                final Exercise exercise = exercises.get(i);
                final String exerciseType = exercise.getType();
                final String exercisePlace = exercise.getPlace();
                final String exerciseName = exercise.getName();
                final String exerciseReps = exercise.getReps();
                final String exerciseWeight = exercise.getWeight();
                final String exerciseProgress = exercise.getProgress();

                final Row row = sheet.createRow(i);
                Cell cell = row.createCell(0);
                cell.setCellValue(exerciseType);
                cell.setCellStyle(style);

                cell = row.createCell(1);
                cell.setCellValue(exercisePlace);
                cell.setCellStyle(style);

                cell = row.createCell(2);
                cell.setCellValue(exerciseName);
                cell.setCellStyle(style);

                cell = row.createCell(3);
                cell.setCellValue(exerciseReps);
                cell.setCellStyle(style);

                cell = row.createCell(4);
                cell.setCellValue(exerciseWeight);
                cell.setCellStyle(style);

                cell = row.createCell(5);
                cell.setCellValue(exerciseProgress);
                cell.setCellStyle(style);
            }

            FileOutputStream outputStream = new FileOutputStream(fileLocation);
            workbook.write(outputStream);
        }
    }

}
