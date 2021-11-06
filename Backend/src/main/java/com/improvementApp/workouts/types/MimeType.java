package com.improvementApp.workouts.types;

public enum MimeType {

    DRIVE_DOC("application/vnd.google-apps.document"),
    DRIVE_EXCEL("application/vnd.google-apps.spreadsheet"),
    DRIVE_FOLDER("application/vnd.google-apps.folder"),
    EXCEL("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    private String type;

    private MimeType(String fileType) {
        type = fileType;
    }

    public String getType() {
        return type;
    }
}
