package com.improvement_app.googledrive.exceptions;

import java.io.IOException;

public class GoogleDriveFileNotDownloadedException extends RuntimeException {
    public GoogleDriveFileNotDownloadedException(IOException e) {
        super(e);
    }
}
