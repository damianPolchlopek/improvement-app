package com.improvementApp.workouts.helpers;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.ExerciseStrategy;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.HypertrophicExercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.CardioExercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.StrengthExercise;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DriveFilesHelper {

    public static List<Exercise> parseExcelFile(final File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);
        XSSFWorkbook wb = new XSSFWorkbook(fis);
        XSSFSheet sheet = wb.getSheetAt(0);

        final int EXERCISE_TYPE_INDEX = 0;
        final int EXERCISE_AREA_INDEX = 1;
        final int NAME_INDEX = 2;
        final int SERIES_INDEX = 3;
        final int WEIGHT_INDEX = 4;
        final int PROGRESS_INDEX = 5;

        List<Exercise> exerciseList = new ArrayList<>();
        for (final Row row : sheet) {

            Cell cell = row.getCell(EXERCISE_TYPE_INDEX);
            if (cell == null)
                continue;

            String exerciseType = cell.getStringCellValue();
            if (exerciseType.isEmpty())
                continue;

            cell = row.getCell(EXERCISE_AREA_INDEX);
            final String exerciseArea = cell.getStringCellValue();
            cell = row.getCell(NAME_INDEX);
            final String exerciseName = cell.getStringCellValue();
            cell = row.getCell(SERIES_INDEX);
            final String reps = cell.getStringCellValue();
            cell = row.getCell(WEIGHT_INDEX);
            final String weight = cell.getStringCellValue();
            cell = row.getCell(PROGRESS_INDEX);
            final String progress = cell.getStringCellValue();
            final LocalDate localDate = getLocalDate(file.getName());
            final String trainingName = getTrainingName(file.getName());

            final ExerciseStrategy exerciseStrategy = getExerciseParseStrategy(exerciseType, reps, weight);
            final List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

            final Exercise exercise = new Exercise(exerciseType,
                    exerciseArea, exerciseName, repAndWeightList, progress, localDate, reps, weight, trainingName);

            exerciseList.add(exercise);
        }

        return exerciseList;
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
            throw new RuntimeException("Unknown training type: " + exerciseType);
        }
    }

    public static LocalDate getLocalDate(final String dateToParse){
        final String regex          = "-?[0-9.?[0-9]*]+ - ([0-9]{2}).([0-9]{2}).([0-9]{4})r. - [A-Z].xlsx";
        final Pattern pattern       = Pattern.compile(regex);
        final Matcher matcher       = pattern.matcher(dateToParse);
        final boolean isMatchFound  = matcher.find();

        if (!isMatchFound){
            throw new RuntimeException("Incorrect string: " + dateToParse
                    + ", for following regex: " + regex);
        }

        final String day = matcher.group(1);
        final String month = matcher.group(2);
        final String year = matcher.group(3);
        final String dateConcatenation = year + "-" + month + "-" + day;

        return LocalDate.parse(dateConcatenation);
    }

    public static String getTrainingName(final String fileName){
        final String regex          = "(-?[0-9.?[0-9]*]+ - [0-9]{2}.[0-9]{2}.[0-9]{4}r. - [A-Z]).xlsx";
        final Pattern pattern       = Pattern.compile(regex);
        final Matcher matcher       = pattern.matcher(fileName);
        final boolean isMatchFound  = matcher.find();

        if (!isMatchFound){
            throw new RuntimeException("Incorrect string: " + fileName
                    + ", for following regex: " + regex);
        }

        return matcher.group(1);
    }

    public static void createExcelFile(final List<Exercise> exercises,
                                       final String fileName) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
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
            final String exerciseType = exercise.getExerciseType();
            final String exercisePlace = exercise.getExercisePlace();
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

        File currDir = new File(ApplicationVariables.TMP_FILES_PATH);
        String path = currDir.getAbsolutePath();
        String fileLocation = path + "/" + fileName;

        FileOutputStream outputStream = new FileOutputStream(fileLocation);
        workbook.write(outputStream);
        workbook.close();
    }

}
