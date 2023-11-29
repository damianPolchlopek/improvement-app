package com.improvement_app.workouts.exceptions;

public class FileNotFoundException extends RuntimeException {
    public FileNotFoundException(Exception e) {
        super(e);
    }
}
