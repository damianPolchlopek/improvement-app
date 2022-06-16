package com.improvement_app.workouts.entity.exercises_fields;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Place {
    @Id
    @Generated
    private String id;
    private String place;

    public Place(String place) {
        this.place = place;
    }

}
