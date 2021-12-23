package com.improvementApp.workouts.entity.ExercisesFields;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;

@Data
public class Type {
    @Id
    @Generated
    private String id;
    private String type;

    public Type(String type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
