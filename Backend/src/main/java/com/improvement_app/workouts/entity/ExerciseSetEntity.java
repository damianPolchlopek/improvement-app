package com.improvement_app.workouts.entity;

import com.improvement_app.common.audit.AuditableEntity;
import com.improvement_app.workouts.request.ExerciseRequest;
import com.improvement_app.workouts.helpers.DriveFilesHelper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.List;

@Entity
@Table(name = "exercise_set", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetEntity extends AuditableEntity {

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

    public static List<ExerciseSetEntity> fromString(ExerciseRequest request) {
        return DriveFilesHelper.parseExerciseSets(
                request.getType(),
                request.getReps(),
                request.getWeight()
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExerciseSetEntity that = (ExerciseSetEntity) o;
        return rep.equals(that.rep) && weight.equals(that.weight);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, rep, weight);
    }
}
