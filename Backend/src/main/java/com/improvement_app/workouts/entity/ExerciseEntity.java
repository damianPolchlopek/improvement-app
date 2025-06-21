package com.improvement_app.workouts.entity;

import com.improvement_app.workouts.controllers.request.ExerciseRequest;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseProgress;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "exercise", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"training", "exerciseSets"})
@ToString(exclude = {"training", "exerciseSets"})
public class ExerciseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    private TrainingEntity training;

    @Enumerated(EnumType.STRING)
    private ExerciseName name;

    @Enumerated(EnumType.STRING)
    private ExerciseType type;

    @Enumerated(EnumType.STRING)
    private ExerciseProgress progress;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id")
    private Set<ExerciseSetEntity> exerciseSets = new LinkedHashSet<>();

    public ExerciseEntity(ExerciseName name, ExerciseType type, ExerciseProgress progress,
                          Set<ExerciseSetEntity> exerciseSets) {
        this.name = name;
        this.type = type;
        this.progress = progress;
        this.exerciseSets = exerciseSets;
        for (ExerciseSetEntity exerciseSet : exerciseSets) {
            exerciseSet.setExercise(this);
        }
    }

    public ExerciseEntity(ExerciseName exerciseName) {
        this.name = exerciseName;
    }

    public static List<ExerciseEntity> create(List<ExerciseRequest> exerciseRequests) {
        List<ExerciseEntity> result = new ArrayList<>();

        for (ExerciseRequest request : exerciseRequests) {
            Set<ExerciseSetEntity> sets = ExerciseSetEntity.fromString(request);
            ExerciseEntity exerciseEntity = new ExerciseEntity(
                    ExerciseName.fromValue(request.getName()),
                    ExerciseType.fromValue(request.getType()),
                    ExerciseProgress.fromValue(request.getProgress()),
                    sets
            );

            result.add(exerciseEntity);
        }

        return result;
    }
}