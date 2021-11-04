package com.improvementApp.workouts.controllers;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Controller
public class Files {

    @GetMapping("/test")
    public void doGoogleSingIn(HttpServletResponse response) throws IOException {

        FileInputStream fis = new FileInputStream(new File("300 - 31.10.2021 - przyklad.xlsx"));
        XSSFWorkbook wb = new XSSFWorkbook(fis);
        XSSFSheet sheet = wb.getSheetAt(0);

        final int EXERCISE_TYPE_INDEX = 0;
        final int EXERCISE_AREA_INDEX = 1;
        final int NAME_INDEX = 2;
        final int SERIES_INDEX = 3;
        final int WEIGHT_INDEX = 4;

        for (Row row: sheet) {
            Cell cell = row.getCell(EXERCISE_TYPE_INDEX);            //getting the cell representing the given column
            String exerciseType = cell.getStringCellValue();       //getting cell value
            System.out.println(exerciseType);

            cell = row.getCell(EXERCISE_AREA_INDEX);
            String exerciseArea = cell.getStringCellValue();
            System.out.println(exerciseArea);

            cell = row.getCell(NAME_INDEX);
            String exerciseName = cell.getStringCellValue();
            System.out.println(exerciseName);

            cell = row.getCell(SERIES_INDEX);
            String series = cell.getStringCellValue();
            System.out.println(series);

            cell = row.getCell(WEIGHT_INDEX);
            double weight = cell.getNumericCellValue();
            System.out.println(weight);
        }

    }

}
