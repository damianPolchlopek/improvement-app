package com.improvementApp.workouts.entity.ExercisesFields;

import lombok.Generated;
import org.springframework.data.annotation.Id;

public class Name {

    @Id
    @Generated
    private String id;
    private String name;

    public Name(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
