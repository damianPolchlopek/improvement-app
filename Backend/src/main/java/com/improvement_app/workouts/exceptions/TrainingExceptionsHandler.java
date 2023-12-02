package com.improvement_app.workouts.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class TrainingExceptionsHandler {

    @ResponseBody
    @ExceptionHandler(ExercisesNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String exerciseNotFoundExceptionHandler(ExercisesNotFoundException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(TrainingTemplateNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String trainingTemplateNotFoundExceptionHandler(TrainingTemplateNotFoundException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(ExerciseTypeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String exerciseTypeNotFoundExceptionHandler(ExerciseTypeNotFoundException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(FileNotCreatedException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String fileNotCreatedExceptionHandler(FileNotCreatedException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(FileNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String fileNotFoundExceptionHandler(FileNotFoundException ex) {
        return ex.getMessage();
    }
}
