package com.improvementApp.workouts.helpers;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.ExerciseStrategy;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.HypertrophicExercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.KardioExercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.StrengthExercise;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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

            final ExerciseStrategy exerciseStrategy = getExerciseParseStrategy(exerciseType, reps, weight);
            final List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

            final Exercise exercise = new Exercise(exerciseType,
                    exerciseArea, exerciseName, repAndWeightList, progress, localDate, reps, weight);

            exerciseList.add(exercise);
        }

        return exerciseList;
    }

    private static ExerciseStrategy getExerciseParseStrategy(final String exerciseType, final String reps, final String weight) {
        final String STRENGTH_TRAINING_NAME = "Siłowy";
        final String HYPERTROPHIC_TRAINING_NAME = "Hipertroficzny";
        final String KARDIO_TRAINING_NAME = "Kardio";

        if (exerciseType.contains(STRENGTH_TRAINING_NAME)) {
            return new StrengthExercise(reps, weight);
        } else if (exerciseType.contains(HYPERTROPHIC_TRAINING_NAME)) {
            return new HypertrophicExercise(reps, weight);
        } else if (exerciseType.contains(KARDIO_TRAINING_NAME)) {
            return new KardioExercise(reps, weight);
        } else {
            throw new RuntimeException("Unknown training type: " + exerciseType);
        }
    }

    private static LocalDate getLocalDate(final String dateToParse){
        final String regex = "-?[0-9.?[0-9]*]+ - ([0-9]{2}).([0-9]{2}).([0-9]{4})r. - [A-Z].xlsx";
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
}
