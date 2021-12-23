package com.improvementApp.workouts.entity.ExercisesFields;

import lombok.Generated;
import org.springframework.data.annotation.Id;

public class Place {
    @Id
    @Generated
    private String id;
    private String place;

    public Place(String place) {
        this.place = place;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }
}
