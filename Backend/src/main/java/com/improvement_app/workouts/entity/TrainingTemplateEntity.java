package com.improvement_app.workouts.entity;

import com.improvement_app.common.audit.basic.AuditableEntity;
import com.improvement_app.workouts.response.TrainingTemplateResponse;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

import java.util.*;

@Entity
@Table(name = "training_template", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "exercises") // Unikaj cyklicznych referencji w toString
public class TrainingTemplateEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "training_template_exercise",
            schema = "workout",
            joinColumns = @JoinColumn(name = "training_template_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_name_id"),
            indexes = {
                    @Index(name = "idx_training_template_exercise_template", columnList = "training_template_id"),
                    @Index(name = "idx_training_template_exercise_name", columnList = "exercise_name_id")
            }
    )
    private List<ExerciseNameEntity> exercises = new ArrayList<>();

    public TrainingTemplateEntity(String name) {
        this.name = name;
    }

    public void addExercise(ExerciseNameEntity exercise) {
        exercises.add(exercise);
        exercise.getTrainingTemplates().add(this);
    }

    public TrainingTemplateResponse toResponse() {
        return TrainingTemplateResponse.of(this);
    }

}
