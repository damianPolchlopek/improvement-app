package com.improvementApp.workouts.entity;

import com.improvementApp.workouts.DTO.RepAndWeight;

import java.util.List;

public class Exercise {
    private String exerciseType;
    private String exercisePlace;
    private String name;
    private List<RepAndWeight> repAndWeightList;
    private String progress;

    public Exercise(String exerciseType, String exercisePlace, String name, List<RepAndWeight> repAndWeightList, String progress) {
        this.exerciseType = exerciseType;
        this.exercisePlace = exercisePlace;
        this.name = name;
        this.repAndWeightList = repAndWeightList;
        this.progress = progress;
    }

    public String getExerciseType() {
        return exerciseType;
    }

    public void setExerciseType(String exerciseType) {
        this.exerciseType = exerciseType;
    }

    public String getExercisePlace() {
        return exercisePlace;
    }

    public void setExercisePlace(String exercisePlace) {
        this.exercisePlace = exercisePlace;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RepAndWeight> getRepAndWeightList() {
        return repAndWeightList;
    }

    public void setRepAndWeightList(List<RepAndWeight> repAndWeightList) {
        this.repAndWeightList = repAndWeightList;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

}
