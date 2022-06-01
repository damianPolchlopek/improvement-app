package com.improvementApp.workouts.entity.ExercisesFields;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Progress {
    @Id
    @Generated
    private String id;
    private String progress;

    public Progress(String progress) {
        this.progress = progress;
    }

}
