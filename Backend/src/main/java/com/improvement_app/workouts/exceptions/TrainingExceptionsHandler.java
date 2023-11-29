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
    public String exerciseNotFoundHandler(ExercisesNotFoundException ex) {
        return ex.getMessage();
    }


    @ResponseBody
    @ExceptionHandler(TrainingTemplateNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String trainingTemplateNotFoundHandler(TrainingTemplateNotFoundException ex) {
        return ex.getMessage();
    }
}
