package com.improvement_app.googledrive.exceptions;

import java.io.IOException;

public class GoogleDriveObjectIdNotFoundException extends RuntimeException {
    public GoogleDriveObjectIdNotFoundException(IOException e) {
        super(e);
    }
}
