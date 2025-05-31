package com.improvement_app.food.infrastructure.googledrivefileparser;

import com.improvement_app.food.domain.enums.Unit;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;

public class GoogleDriveFilesHelper {

    protected boolean checkIfNextRowExists(Row row) {
        final int FIRST_CELL_INDEX = 0;
        Cell cell = row.getCell(FIRST_CELL_INDEX);
        if (cell == null) {
            return false;
        }

        if (cell.getCellType() == CellType.STRING) {
            String firstCellValue = cell.getStringCellValue();
            if (firstCellValue.equals("id")) {
                return false;
            }
            return !firstCellValue.isEmpty();
        }

        return cell.getCellType() != CellType.BLANK;
    }

    protected Unit parseUnit(final String unit) {
        return switch (unit) {
            case "g" -> Unit.gram;
            case "ml" -> Unit.ml;
            case "sztuk" -> Unit.sztuk;
            case "łyżka" -> Unit.łyżka;
            case "łyżeczka" -> Unit.łyżeczka;
            case "szczypta" -> Unit.szczypta;
            case "słoik" -> Unit.słoik;
            default -> throw new RuntimeException("Bad Unit " + unit + " !!!");
        };
    }

}
