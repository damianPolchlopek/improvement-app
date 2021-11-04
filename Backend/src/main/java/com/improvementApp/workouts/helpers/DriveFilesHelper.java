package com.improvementApp.workouts.helpers;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.DTO.RepAndWeight;
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
import java.util.ArrayList;
import java.util.List;

public class DriveFilesHelper {

    public static List<Exercise> parseExcelFile(final File file) throws IOException {
        FileInputStream fis     = new FileInputStream(file);
        XSSFWorkbook wb         = new XSSFWorkbook(fis);
        XSSFSheet sheet         = wb.getSheetAt(0);

        final int EXERCISE_TYPE_INDEX   = 0;
        final int EXERCISE_AREA_INDEX   = 1;
        final int NAME_INDEX            = 2;
        final int SERIES_INDEX          = 3;
        final int WEIGHT_INDEX          = 4;
        final int PROGRESS_INDEX        = 5;

        List<Exercise> exerciseList = new ArrayList<>();
        for (final Row row: sheet) {
            Cell cell               = row.getCell(EXERCISE_TYPE_INDEX);
            String exerciseType     = cell.getStringCellValue();

            if (exerciseType.isEmpty())
                continue;

            cell = row.getCell(EXERCISE_AREA_INDEX);
            String exerciseArea = cell.getStringCellValue();

            cell = row.getCell(NAME_INDEX);
            String exerciseName = cell.getStringCellValue();

            cell = row.getCell(SERIES_INDEX);
            String reps = cell.getStringCellValue();

            cell = row.getCell(WEIGHT_INDEX);
            String weight = cell.getStringCellValue();

            cell = row.getCell(PROGRESS_INDEX);
            String progress = cell.getStringCellValue();

//            System.out.println(exerciseType);
//            System.out.println(exerciseArea);
//            System.out.println(exerciseName);
//            System.out.println(reps);
//            System.out.println(weight);
//            System.out.println(progress);

            ExerciseStrategy exerciseStrategy = getExerciseParseStrategy(exerciseType, reps, weight);
            List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

            Exercise exercise = new Exercise(exerciseType,
                    exerciseArea, exerciseName, repAndWeightList, progress);

            exerciseList.add(exercise);
        }

        return exerciseList;
    }

    private static ExerciseStrategy getExerciseParseStrategy(final String exerciseType, final String reps, final String weight){
        if (exerciseType.contains("Siłowy")){
            return new StrengthExercise(reps, weight);
        } else if (exerciseType.contains("Hipertroficzny")){
            return new HypertrophicExercise(reps, weight);
        } else if (exerciseType.contains("Kardio")){
            return new KardioExercise(reps, weight);
        } else {
            throw new RuntimeException("Unknown training type: " + exerciseType);
        }
    }
}
