package com.improvement_app.googledrive.types;

import lombok.Getter;

@Getter
public enum MimeType {
    DRIVE_SHEETS("application/vnd.google-apps.spreadsheet"),
    DRIVE_FOLDER("application/vnd.google-apps.folder"),
    EXCEL("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    EXCEL_DOWNLOAD("application/vnd.ms-excel");

    private final String type;

    MimeType(String fileType) {
        type = fileType;
    }

}
