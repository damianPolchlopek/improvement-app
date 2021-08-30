package com.improvementApp.workouts.entity;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Exercise {

    @Id
    @Generated
    private String id;
    private String name;
    private int series;
    private int repetition;

    public Exercise(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Exercise(String id, String name, int series, int repetition) {
        this.id = id;
        this.name = name;
        this.series = series;
        this.repetition = repetition;
    }

    public Exercise(String name, int series, int repetition) {
        this.name = name;
        this.series = series;
        this.repetition = repetition;
    }

    public Exercise() {
    }
}
