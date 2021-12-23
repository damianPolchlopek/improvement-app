package com.improvementApp.workouts.entity.ExercisesFields;

import lombok.Generated;
import org.springframework.data.annotation.Id;

public class Progress {
    @Id
    @Generated
    private String id;
    private String progress;

    public Progress(String progress) {
        this.progress = progress;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}
