package com.improvementApp.workouts.entity;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import lombok.Generated;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
//TODO: zmienic nazwy exerciseType i exercisePlace na type i place !!!
public class Exercise {

    @Id
    @Generated
    private String id;
    private String exerciseType;
    private String exercisePlace;
    private String name;
    private List<RepAndWeight> repAndWeightList;
    private String progress;
    private LocalDate date;
    private String trainingName;

    private String reps;
    private String weight;

    public Exercise(String exerciseType, String exercisePlace, String name, List<RepAndWeight> repAndWeightList,
                    String progress, LocalDate date, String reps, String weight, String trainingName) {
        this.exerciseType = exerciseType;
        this.exercisePlace = exercisePlace;
        this.name = name;
        this.repAndWeightList = repAndWeightList;
        this.progress = progress;
        this.date = date;
        this.reps = reps;
        this.weight = weight;
        this.trainingName = trainingName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getReps() {
        return reps;
    }

    public void setReps(String reps) {
        this.reps = reps;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getTrainingName() {
        return trainingName;
    }

    public void setTrainingName(String trainingName) {
        this.trainingName = trainingName;
    }

    @Override
    public String toString() {
        return "Exercise{" +
                "id='" + id + '\'' +
                ", exerciseType='" + exerciseType + '\'' +
                ", exercisePlace='" + exercisePlace + '\'' +
                ", name='" + name + '\'' +
                ", repAndWeightList=" + repAndWeightList +
                ", progress='" + progress + '\'' +
                ", date=" + date +
                ", trainingName='" + trainingName + '\'' +
                ", reps='" + reps + '\'' +
                ", weight='" + weight + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Exercise exercise = (Exercise) o;
        return Objects.equals(id, exercise.id) &&
                Objects.equals(exerciseType, exercise.exerciseType) &&
                Objects.equals(exercisePlace, exercise.exercisePlace) &&
                Objects.equals(name, exercise.name) &&
                Objects.equals(repAndWeightList, exercise.repAndWeightList) &&
                Objects.equals(progress, exercise.progress) &&
                Objects.equals(date, exercise.date) &&
                Objects.equals(trainingName, exercise.trainingName) &&
                Objects.equals(reps, exercise.reps) &&
                Objects.equals(weight, exercise.weight);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, exerciseType, exercisePlace, name, repAndWeightList, progress, date, trainingName, reps, weight);
    }
}
