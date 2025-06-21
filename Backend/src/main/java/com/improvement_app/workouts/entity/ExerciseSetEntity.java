package com.improvement_app.workouts.entity;

import com.improvement_app.workouts.controllers.request.ExerciseRequest;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "exercise_set", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private ExerciseEntity exercise;

    private Double rep;

    private Double weight;

    public ExerciseSetEntity(Double rep, Double weight) {
        this.rep = rep;
        this.weight = weight;
    }

    public Double getCapacity() {
        return rep * weight;
    }

    public static Set<ExerciseSetEntity> fromString(ExerciseRequest request) {
        return DriveFilesHelper.parseExerciseSets(
                request.getType(),
                request.getReps(),
                request.getWeight()
        );
    }
}
