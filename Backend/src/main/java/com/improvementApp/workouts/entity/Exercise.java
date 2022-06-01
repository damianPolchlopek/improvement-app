package com.improvementApp.workouts.entity;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Data
@Document
public class Exercise {

    @Id
    @Generated
    private String id;
    private String type;
    private String place;
    private String name;
    private List<RepAndWeight> repAndWeightList;
    private String progress;
    private LocalDate date;
    private String trainingName;

    private String reps;
    private String weight;

    private int index;

    public Exercise() {
    }

    public Exercise(String type, String place, String name, List<RepAndWeight> repAndWeightList,
                    String progress, LocalDate date, String reps, String weight, String trainingName) {
        this.type = type;
        this.place = place;
        this.name = name;
        this.repAndWeightList = repAndWeightList;
        this.progress = progress;
        this.date = date;
        this.reps = reps;
        this.weight = weight;
        this.trainingName = trainingName;
    }

    public Exercise(String type, String place, String name, List<RepAndWeight> repAndWeightList,
                    String progress, LocalDate date, String reps, String weight, String trainingName,
                    int index) {
        this.type = type;
        this.place = place;
        this.name = name;
        this.repAndWeightList = repAndWeightList;
        this.progress = progress;
        this.date = date;
        this.trainingName = trainingName;
        this.reps = reps;
        this.weight = weight;
        this.index = index;
    }

}
