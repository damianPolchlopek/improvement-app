package com.improvement_app.workouts.entity.exercisesfields;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Name {

    @Id
    @Generated
    private String id;
    private String name;

    public Name(String name) {
        this.name = name;
    }

}
