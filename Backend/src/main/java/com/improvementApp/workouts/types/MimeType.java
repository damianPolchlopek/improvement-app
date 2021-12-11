package com.improvementApp.workouts.types;

public enum MimeType {

    DRIVE_DOC("application/vnd.google-apps.document"),
    DRIVE_SHEETS("application/vnd.google-apps.spreadsheet"),
    DRIVE_FOLDER("application/vnd.google-apps.folder"),
    EXCEL("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    EXCEL_DOWNLOAD("application/vnd.ms-excel"),
    CSV("text/csv");

    private String type;

    MimeType(String fileType) {
        type = fileType;
    }

    public String getType() {
        return type;
    }
}
