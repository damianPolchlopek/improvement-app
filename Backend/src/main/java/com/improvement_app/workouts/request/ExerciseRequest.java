package com.improvement_app.workouts.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExerciseRequest {

    private String id;
    private String type;
    private String place;
    private String trainingName;
    private LocalDate date;

    private String name;
    private String progress;
    private String reps;
    private String weight;
    private int index;

    public ExerciseRequest(String type, String place, String name,
                           String progress, LocalDate date, String reps, String weight, String trainingName,
                           int index) {
        this.type = type;
        this.place = place;
        this.name = name;
        this.progress = progress;
        this.date = date;
        this.trainingName = trainingName;
        this.reps = reps;
        this.weight = weight;
        this.index = index;
    }

}
