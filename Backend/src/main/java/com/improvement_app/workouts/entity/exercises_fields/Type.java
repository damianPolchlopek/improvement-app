package com.improvement_app.workouts.entity.exercises_fields;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Type {
    @Id
    @Generated
    private String id;
    private String type;

    public Type(String type) {
        this.type = type;
    }

}
