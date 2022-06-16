package com.improvement_app.workouts.entity;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Document
@NoArgsConstructor
public class Exercise {

    @Id
    @Generated
    private String id;
    private String type;
    private String place;
    private List<RepAndWeight> repAndWeightList;
    private String trainingName;
    private LocalDate date;

    private String name;
    private String progress;
    private String reps;
    private String weight;
    private int index;

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
