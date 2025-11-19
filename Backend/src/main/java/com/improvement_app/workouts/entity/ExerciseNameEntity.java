package com.improvement_app.workouts.entity;

import com.improvement_app.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "exercise_name", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "trainingTemplates")
public class ExerciseNameEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "exercises", fetch = FetchType.LAZY)
    private Set<TrainingTemplateEntity> trainingTemplates = new HashSet<>();

    public ExerciseNameEntity(String name) {
        this.name = name;
    }
}
